import mysql, { PoolOptions } from 'mysql2/promise'

const access: PoolOptions = {
  user: 'root',
  database: 'ims_upt',
  password: '',
  port: 3306
}

const conn = mysql.createPool(access)

export default conn
