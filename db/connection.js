// Import dependencies
const mysql = require('mysql2');

// Connection to the db
const db = mysql.createConnection(

    {

        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employee_db'

    }

);

db.connect((err) => {
    if (err) throw err;
    console.log('connected to database');
});

module.exports = db;