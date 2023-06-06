// Import dependencies
const mysql = require('mysql2');

// Connection to the db
const db = mysql.createConnection(

    {

        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'

    },
    console.log('Connected successfully')

);

module.exports = db;