var mysql = require('mysql');
const connection = mysql.createConnection({
  /**host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE**/
  host: "localhost",
  user: "root",
  password: "",
  database: "hap"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
