const mysql = require('mysql');
const { mysqlHost, mysqlUser, mysqlPassword } = require('../config.js');
const data = require('./unsplashData.js');

var connection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
});

const table = 'CREATE TABLE IF NOT EXISTS SDC_Image_Service_MySQL_10Million.images (itemId VARCHAR(10) NOT NULL UNIQUE PRIMARY KEY, itemImages VARCHAR(90) NOT NULL)';

connection.connect((err) => {
  if (err) {
    console.log('connection error: ', err);
    connection.end();
  } else {
    connection.query('CREATE DATABASE IF NOT EXISTS SDC_Image_Service_MySQL_10Million', (err) => {
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
            for (let i = 0; i < 1000; i++) {
              setTimeout(seed.handleSeeding.bind(null, 10, 25, 10, true, data, i * 10), 3500 * i);
            }
          }
          connection.end();
        });
      }
    });
  }
});

