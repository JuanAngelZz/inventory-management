import { Request, Response } from 'express'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { GOOGLE_GEN_AI_KEY } from '../config'
import conn from '../db'
import { RowDataPacket } from 'mysql2'

const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY)

// --- Tools Definitions ---

const tools: any = [
  {
    functionDeclarations: [
      {
        name: 'listProducts',
        description: 'Get a list of recent products added to the inventory.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            limit: {
              type: SchemaType.NUMBER,
              description: 'The maximum number of products to return. Default is 5.'
            }
          }
        }
      },
      {
        name: 'searchProducts',
        description: 'Search for products to get their details, current stock levels, and prices.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: 'The search term (e.g., "laptop", "monitor").'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'getStats',
        description: 'Get general statistics about the inventory (total products, total value).',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {}
        }
      },
      {
        name: 'getLowStock',
        description: 'Get a list of products with low stock.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            threshold: {
              type: SchemaType.NUMBER,
              description: 'The stock threshold to consider "low". Default is 10.'
            }
          }
        }
      }
    ]
  }
]

// --- Tool Implementations ---

async function listProducts(args: { limit?: number } = {}) {
  const limit = args.limit || 5
  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT id, nombre, stock, precio_venta FROM productos ORDER BY id DESC LIMIT ?',
    [limit]
  )
  return rows
}

async function searchProducts(args: { query: string }) {
  const query = args.query
  console.log(`[searchProducts] Query arg: "${query}"`)
  try {
    const searchTerm = `%${query}%`
    console.log(`[searchProducts] SQL Search Term: "${searchTerm}"`)
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT id, nombre, stock, precio_venta, descripcion FROM productos WHERE nombre LIKE ? OR descripcion LIKE ? LIMIT 10',
      [searchTerm, searchTerm]
    )
    console.log(`[searchProducts] Found ${rows.length} products`)
    return rows
  } catch (error) {
    console.error('[searchProducts] Error:', error)
    return []
  }
}

async function getStats() {
  const [countRows] = await conn.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM productos'
  )
  const [valueRows] = await conn.query<RowDataPacket[]>(
    'SELECT SUM(stock * precio_compra) as totalValue FROM productos'
  )
  return {
    totalProducts: countRows[0].total,
    totalInventoryValue: valueRows[0].totalValue
  }
}

async function getLowStock(args: { threshold?: number } = {}) {
  const threshold = args.threshold || 10
  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT id, nombre, stock FROM productos WHERE stock <= ? ORDER BY stock ASC LIMIT 20',
    [threshold]
  )
  return rows
}

// --- Controller ---

const functions: Record<string, Function> = {
  listProducts,
  searchProducts,
  getStats,
  getLowStock
}

export const postChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messages } = req.body

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
      tools: tools,
      systemInstruction: `You are a helpful inventory assistant for a business. 
      Your goal is to provide accurate information about products, stock levels, and statistics.
      
      IMPORTANT:
      - ALWAYS respond in Spanish.
      - USE THE PROVIDED TOOLS directly. Do not write code (like Python or JavaScript) to call them. Just invoke the tool function.
      - The chat history only contains text, not previous tool outputs. 
      - If a user asks a follow-up question about a product (like "how much stock?") and you don't see the number in the recent text history, YOU MUST CALL the 'searchProducts' tool again to get the fresh data.
      - Do not guess or refuse to answer if you can look it up.
      - Always be polite and professional.`
    })

    // Gemini requires history to start with a user message
    // We filter out any initial model messages (like the greeting)
    const historyMessages = messages.slice(0, -1)
    const firstUserIndex = historyMessages.findIndex((m: any) => m.role === 'user')
    
    const validHistory = firstUserIndex !== -1 
      ? historyMessages.slice(firstUserIndex).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content || m.text }]
        }))
      : []

    const chat = model.startChat({
      history: validHistory
    })

    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content || lastMessage.text

    const result = await chat.sendMessage(userMessage)
    const response = result.response
    const call = response.functionCalls()

    if (call) {
      const functionCalls = call
      const functionResponses = []

      for (const call of functionCalls) {
        console.log(`[AI] Calling tool: ${call.name} with args:`, call.args)
        const apiFunction = functions[call.name]
        if (apiFunction) {
          const functionResult = await apiFunction(call.args)
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: functionResult }
            }
          })
        }
      }

      // Send the function results back to the model
      const finalResult = await chat.sendMessage(functionResponses)
      return res.json({ response: finalResult.response.text() })
    }

    return res.json({ response: response.text() })
  } catch (e) {
    console.error('Error in AI chat:', e)
    return res.status(500).json({ error: 'Error processing your request' })
  }
}

