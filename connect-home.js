const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BLR2_ARMS',
    password: '12345678',
    port: 5432   
});
module.exports = pool;