const { Pool } = require('pg')



const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "HW9",
    password: "aingnusaha",
    port: 5432
})

module.exports = pool