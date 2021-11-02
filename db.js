import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig ={
    user:process.env.PG_USER ,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    ssl:{
        rejectUnauthorized: false
    }
};

const proConfig = {
    connectionString: process.env.DATABASE_URL
}

proConfig.ssl = {rejectUnauthorized: false }

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

export default pool;