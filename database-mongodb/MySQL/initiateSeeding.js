const mysql = require('mysql');
const { mysqlHost, mysqlUser, mysqlPassword } = require('../../config.js');

var connection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
});

const table = 'CREATE TABLE IF NOT EXISTS SDC_Image_Service_MySQL.images (itemId VARCHAR(10) NOT NULL UNIQUE PRIMARY KEY, itemImages VARCHAR(90) NOT NULL)';

connection.connect((err) => {
  if (err) {
    console.log('connection error: ', err);
    connection.end();
  } else {
    connection.query('CREATE DATABASE IF NOT EXISTS SDC_Image_Service_MySQL', (err) => {
      if (err) {
        console.log('database creation error: ', err);
        connection.end();
      } else {
        connection.query(table, (err) => {
          if (err) {
            console.log(err);
          } else {
            const seed = require('./seed.js');
            //when generating 10,000,000 records change arguments to: (10, 25, 10000, true)
            //arguments map to numberOfRequests, urlsPerRequest, totalNumberOfBatches, and actuallyInsert
            seed.handleSeeding(2, 25, 2, true);
          }
          connection.end();
        }
        );
      }
    });
  }
});


