import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    host: process.env.BD_HOST,
    password: process.env.BD_PASS,
    user: process.env.BD_USER,
    database: process.env.BD_NAME,
    port: process.env.BD_PORT,
})

export default pool