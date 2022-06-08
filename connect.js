const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'user',
    host: '172.23.162.121',
    database: 'BLR2_ARMS',
    password: '12345678',
    port: 5432   
});
module.exports = pool;