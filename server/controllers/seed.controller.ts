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

// Data for seeding
const categories = [
  'Electrónica',
  'Ropa',
  'Hogar',
  'Alimentos',
  'Juguetes',
  'Deportes',
  'Libros',
  'Salud',
  'Belleza',
  'Automotriz'
]

const suppliers = [
  { name: 'ElectroTech', type: 'J' },
  { name: 'FashionHub', type: 'J' },
  { name: 'HomeGoods Inc.', type: 'J' },
  { name: 'FreshFoods Co.', type: 'J' },
  { name: 'ToyWorld', type: 'J' },
  { name: 'SportLine', type: 'V' },
  { name: 'Bookworm Store', type: 'V' },
  { name: 'HealthyLife', type: 'V' },
  { name: 'BeautyZone', type: 'V' },
  { name: 'AutoParts Deluxe', type: 'J' }
]

const users = ['carlos', 'ana', 'pedro', 'laura', 'sofia']

const products = [
  { name: 'Laptop', description: 'Laptop de última generación' },
  { name: 'Camiseta', description: 'Camiseta de algodón' },
  { name: 'Sofá', description: 'Sofá de tres plazas' },
  { name: 'Manzanas', description: 'Manzanas frescas' },
  { name: 'Muñeca', description: 'Muñeca de trapo' },
  { name: 'Balón de fútbol', description: 'Balón oficial de la liga' },
  { name: 'Libro de ciencia ficción', description: 'Bestseller internacional' },
  { name: 'Vitaminas', description: 'Suplemento vitamínico' },
  { name: 'Crema facial', description: 'Crema hidratante' },
  { name: 'Aceite de motor', description: 'Aceite sintético para motor' }
]

export const seed = async (req: Request, res: Response) => {
  try {
    // Clear existing data
    await pool.query('SET FOREIGN_KEY_CHECKS=0')
    await pool.query('TRUNCATE TABLE movimientos')
    await pool.query('TRUNCATE TABLE productos')
    await pool.query('TRUNCATE TABLE proveedores')
    await pool.query('TRUNCATE TABLE usuarios')
    await pool.query('TRUNCATE TABLE categorias')
    await pool.query('TRUNCATE TABLE codigos_telefono')
    await pool.query('SET FOREIGN_KEY_CHECKS=1')

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
    const insertedCategoryIds: any[] = []
    for (const name of categories) {
      const [result]: any = await pool.query(
        'INSERT INTO categorias (nombre) VALUES (?)',
        [name]
      )
      insertedCategoryIds.push(result.insertId)
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
          'Dirección de prueba',
          getRandomElement(insertedPhoneCodeIds)
        ]
      )
      insertedSupplierIds.push(result.insertId)
    }

    // Seed usuarios
    const adminPassword = await bcrypt.hash('admin123', 10)
    await pool.query(
      'INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?)',
      ['admin', adminPassword, 'administrador']
    )

    for (const name of users) {
      const password = await bcrypt.hash('password123', 10)
      await pool.query(
        'INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?)',
        [name, password, getRandomElement(['administrador', 'usuario'])]
      )
    }

    // Seed productos
    for (let i = 0; i < 25; i++) {
      const product = getRandomElement(products)
      const price = getRandomNumber(10, 200)
      const acquisitionDate = new Date()
      acquisitionDate.setDate(acquisitionDate.getDate() - getRandomNumber(1, 365))
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + getRandomNumber(30, 365))

      await pool.query(
        'INSERT INTO productos (nombre, descripcion, stock, precio_compra, precio_venta, fecha_adquisicion, fecha_vencimiento, categoria_id, proveedor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          `${product.name} ${i + 1}`,
          product.description,
          getRandomNumber(10, 100),
          price,
          price * 1.5,
          acquisitionDate,
          expirationDate,
          getRandomElement(insertedCategoryIds),
          getRandomElement(insertedSupplierIds)
        ]
      )
    }

    res.status(200).json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error seeding database' })
  }
}
