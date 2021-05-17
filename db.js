import pg from 'pg';
const {Pool} = pg;

let localPoolConfig = {
    user: 'me',
    host: 'localhost',
    database: 'jwttut',
    password: 'password',
    port: 5432,
}

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
} : localPoolConfig;

const pool = new Pool(poolConfig);
export default pool;