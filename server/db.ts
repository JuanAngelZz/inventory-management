import mysql, { PoolOptions } from 'mysql2/promise'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } from './config'

const access: PoolOptions = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: +DB_PORT,
  multipleStatements: true
}

const conn = mysql.createPool(access)

export default conn
