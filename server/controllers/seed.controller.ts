import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db'

// Helper function to get a random element from an array
const getRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper function to generate a random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to generate a random date within the last N months
const getRandomDate = (monthsBack: number) => {
  const end = new Date().getTime()
  const start = new Date().setMonth(new Date().getMonth() - monthsBack)
  return new Date(start + Math.random() * (end - start))
}

// Data for seeding - Venezuelan Context
const categories = [
  'Charcutería',
  'Bebidas',
  'Chucherías',
  'Lácteos',
  'Víveres'
]

const suppliers = [
  { name: 'Alimentos Polar', type: 'Proveedor de Alimentos', address: 'Av. Principal de Los Cortijos de Lourdes, Caracas' },
  { name: 'Plumrose Latinoamericana', type: 'Proveedor de Embutidos', address: 'Av. Urdaneta, Edif. Plumrose, Caracas' },
  { name: 'Nestlé Venezuela', type: 'Proveedor de Alimentos', address: 'Av. Principal de La Castellana, Caracas' },
  { name: 'Coca-Cola FEMSA', type: 'Proveedor de Bebidas', address: 'Av. Principal de Los Ruices, Caracas' },
  { name: 'Procter & Gamble', type: 'Proveedor de Cuidado Personal', address: 'La Trinidad, Caracas' },
  { name: 'Distribuidora Heinz', type: 'Proveedor de Alimentos', address: 'San Joaquin, Carabobo' },
  { name: 'Pepsi-Cola Venezuela', type: 'Proveedor de Bebidas', address: 'Av. Principal de Los Cortijos, Caracas' },
  { name: 'Corporación Inlaca', type: 'Proveedor de Lácteos', address: 'Zona Industrial Valencia, Carabobo' },
  { name: 'Puro Lomo', type: 'Proveedor de Carnes', address: 'Maracay, Aragua' },
  { name: 'Farmatodo', type: 'Proveedor de Misceláneos', address: 'Av. Rómulo Gallegos, Caracas' }
]

const users = ['Juan', 'María', 'Carlos', 'Pedro', 'Laura']

const productsData = [
  // Víveres
  { name: 'Harina P.A.N.', description: 'Harina de maíz precocida blanca', category: 'Víveres' },
  { name: 'Arroz Primor', description: 'Arroz blanco de mesa tipo I', category: 'Víveres' },
  { name: 'Pasta Mary', description: 'Pasta de sémola durum', category: 'Víveres' },
  { name: 'Mayonesa Kraft', description: 'Mayonesa real', category: 'Víveres' },
  { name: 'Salsa de Tomate Heinz', description: 'Ketchup clásico', category: 'Víveres' },
  { name: 'Diablitos Underwood', description: 'Jamón endiablado', category: 'Víveres' },
  { name: 'Café Fama de América', description: 'Café molido clásico', category: 'Víveres' },
  { name: 'Azúcar Montalbán', description: 'Azúcar refinada', category: 'Víveres' },
  { name: 'Aceite Vatel', description: 'Aceite vegetal comestible', category: 'Víveres' },
  { name: 'Atún Margarita', description: 'Atún en aceite vegetal', category: 'Víveres' },

  // Charcutería
  { name: 'Queso Paisa', description: 'Queso blanco pasteurizado', category: 'Charcutería' },
  { name: 'Jamón Plumrose', description: 'Jamón cocido superior', category: 'Charcutería' },
  { name: 'Salchichas Viena', description: 'Salchichas tipo viena', category: 'Charcutería' },
  { name: 'Chuleta Ahumada', description: 'Chuleta de cerdo ahumada', category: 'Charcutería' },
  { name: 'Queso Amarillo Torondoy', description: 'Queso amarillo tipo gouda', category: 'Charcutería' },
  { name: 'Mortadela Tapara', description: 'Mortadela especial', category: 'Charcutería' },

  // Bebidas
  { name: 'Malta Polar', description: 'Bebida de malta', category: 'Bebidas' },
  { name: 'Frescolita', description: 'Refresco sabor a colita', category: 'Bebidas' },
  { name: 'Chinotto', description: 'Refresco sabor a limón', category: 'Bebidas' },
  { name: 'Pepsi', description: 'Refresco de cola negra', category: 'Bebidas' },
  { name: 'Jugo de Naranja', description: 'Jugo natural pasteurizado', category: 'Bebidas' },
  { name: 'Cerveza Polar Pilsen', description: 'Cerveza tipo pilsen', category: 'Bebidas' },
  { name: 'Toddy', description: 'Bebida de chocolate en polvo', category: 'Bebidas' },
  { name: 'Chicha El Chichero', description: 'Bebida de arroz y leche', category: 'Bebidas' },

  // Chucherías
  { name: 'Pepito', description: 'Snack de queso', category: 'Chucherías' },
  { name: 'Cocosette', description: 'Galleta rellena de coco', category: 'Chucherías' },
  { name: 'Susy', description: 'Galleta rellena de chocolate', category: 'Chucherías' },
  { name: 'Toronto', description: 'Bombón de chocolate con avellana', category: 'Chucherías' },
  { name: 'Samba', description: 'Galleta cubierta de chocolate con fresa', category: 'Chucherías' },
  { name: 'Oreo', description: 'Galleta tipo sándwich de chocolate', category: 'Chucherías' },
  { name: 'Pirulin', description: 'Barquillas rellenas de chocolate', category: 'Chucherías' },
  { name: 'Ovomaltina', description: 'Crema de chocolate con malta', category: 'Chucherías' },
  { name: 'Chocolate Savoy Leche', description: 'Tableta de chocolate con leche', category: 'Chucherías' },

  // Lácteos
  { name: 'Leche en Polvo La Campiña', description: 'Leche completa en polvo', category: 'Lácteos' },
  { name: 'Yogurt Migurt', description: 'Yogurt batido de fresa', category: 'Lácteos' },
  { name: 'Rikesa', description: 'Queso fundido tipo cheddar', category: 'Lácteos' },
  { name: 'Margarina Mavesa', description: 'Margarina con sal', category: 'Lácteos' },
  { name: 'Mantequilla Maracay', description: 'Mantequilla con sal', category: 'Lácteos' },
  { name: 'Leche Condensada Natulac', description: 'Leche condensada azucarada', category: 'Lácteos' }
]

import fs from 'fs'
import path from 'path'

// ... imports

export const seed = async (req: Request, res: Response) => {
  try {
    const [tables] = (await pool.query('SHOW TABLES')) as any[]

    if (tables.length === 0) {
      // Create tables if they don't exist
      const sql = fs.readFileSync(path.join(__dirname, '../../create_tables.sql'), 'utf-8')
      const queries = sql.split(';').filter(query => query.trim() !== '')

      for (const query of queries) {
        if (query.trim()) {
          await pool.query(query)
        }
      }
    } else {
      // Clear existing data
      await pool.query('SET FOREIGN_KEY_CHECKS=0')
      const tableNames = ['movimientos', 'productos', 'proveedores', 'usuarios', 'categorias', 'codigos_telefono']
      for (const table of tableNames) {
        try {
          await pool.query(`TRUNCATE TABLE ${table}`)
        } catch (error) {
          console.warn(`Could not truncate table ${table}, it might not exist.`)
        }
      }
      await pool.query('SET FOREIGN_KEY_CHECKS=1')
    }

    // ... rest of the seeding logic

    // Seed codigos_telefono
    const phoneCodes = [
      { operadora: 'Movistar', codigo_operadora: '0414' },
      { operadora: 'Movistar', codigo_operadora: '0424' },
      { operadora: 'Digitel', codigo_operadora: '0412' },
      { operadora: 'Movilnet', codigo_operadora: '0416' },
      { operadora: 'Movilnet', codigo_operadora: '0426' }
    ]
    const insertedPhoneCodeIds: any[] = []
    for (const code of phoneCodes) {
      const [result]: any = await pool.query(
        'INSERT INTO codigos_telefono (operadora, codigo_operadora) VALUES (?, ?)',
        [code.operadora, code.codigo_operadora]
      )
      insertedPhoneCodeIds.push(result.insertId)
    }

    // Seed categorias
    const categoryMap = new Map<string, number>()
    for (const name of categories) {
      const [result]: any = await pool.query(
        'INSERT INTO categorias (nombre) VALUES (?)',
        [name]
      )
      categoryMap.set(name, result.insertId)
    }

    // Seed proveedores
    const insertedSupplierIds: any[] = []
    for (const supplier of suppliers) {
      const [result]: any = await pool.query(
        'INSERT INTO proveedores (nombre, tipo, telefono, direccion, codigo_telefono_id) VALUES (?, ?, ?, ?, ?)',
        [
          supplier.name,
          supplier.type,
          getRandomNumber(1000000, 9999999).toString(),
          supplier.address,
          getRandomElement(insertedPhoneCodeIds)
        ]
      )
      insertedSupplierIds.push(result.insertId)
    }

    // Seed usuarios
    const adminPassword = await bcrypt.hash('admin123', 10)
    await pool.query(
      'INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE contrasena = VALUES(contrasena)',
      ['admin', adminPassword, 'administrador']
    )

    for (const name of users) {
      const password = await bcrypt.hash('password123', 10)
      await pool.query(
        'INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?)',
        [name, password, getRandomElement(['administrador', 'usuario'])]
      )
    }

    // Seed productos and movimientos
    for (const productData of productsData) {
      const categoryId = categoryMap.get(productData.category)
      const supplierId = getRandomElement(insertedSupplierIds)
      const price = getRandomNumber(2, 50) // Prices in USD equivalent roughly
      const acquisitionDate = getRandomDate(6) // Acquired within last 6 months
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + getRandomNumber(5, 365))

      // 1. Create Product with initial 0 stock (will update later)
      const [productResult]: any = await pool.query(
        'INSERT INTO productos (nombre, descripcion, stock, precio_compra, precio_venta, fecha_adquisicion, fecha_vencimiento, categoria_id, proveedor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          productData.name,
          productData.description,
          0, // Initial stock, will be calculated
          price,
          price * 1.3, // 30% margin
          acquisitionDate,
          expirationDate,
          categoryId,
          supplierId
        ]
      )
      const productId = productResult.insertId

      // 2. Generate Movements
      let currentStock = 0
      const numMovements = getRandomNumber(5, 20)

      // Ensure at least one initial entry
      const initialEntryQty = getRandomNumber(50, 200)
      await pool.query(
        'INSERT INTO movimientos (tipo, cantidad, fecha, producto_id) VALUES (?, ?, ?, ?)',
        ['entrada', initialEntryQty, acquisitionDate, productId]
      )
      currentStock += initialEntryQty

      // Generate random subsequent movements
      for (let i = 0; i < numMovements; i++) {
        const isEntry = Math.random() > 0.7 // 30% chance of restocking, 70% sales
        const moveDate = getRandomDate(5) // Movements in last 5 months

        // Ensure date is after acquisition
        if (moveDate < acquisitionDate) continue

        if (isEntry) {
          const qty = getRandomNumber(10, 50)
          await pool.query(
            'INSERT INTO movimientos (tipo, cantidad, fecha, producto_id) VALUES (?, ?, ?, ?)',
            ['entrada', qty, moveDate, productId]
          )
          currentStock += qty
        } else {
          // Sale
          const qty = getRandomNumber(1, 10)
          if (currentStock >= qty) {
            await pool.query(
              'INSERT INTO movimientos (tipo, cantidad, fecha, producto_id) VALUES (?, ?, ?, ?)',
              ['salida', qty, moveDate, productId]
            )
            currentStock -= qty
          }
        }
      }

      // 3. Update Product with final stock
      await pool.query(
        'UPDATE productos SET stock = ? WHERE id = ?',
        [currentStock, productId]
      )
    }

    res.status(200).json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error seeding database' })
  }
}
