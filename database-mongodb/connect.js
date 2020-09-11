const mysql = require('mysql');
const { mysqlHost, mysqlUser, mysqlPassword } = require('../config.js');

var connection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: 'SDC_Image_Service_MySQL_10Million_PostTest'
});

module.exports = connection;
