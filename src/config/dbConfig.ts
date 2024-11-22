import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPass,
    port: Number(config.dbPort),
});

export default pool;
