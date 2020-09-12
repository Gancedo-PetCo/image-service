const morgan = require('morgan');
const app = require('./index.js');
const connection = require('../database-mongodb/connect.js');
const PORT = 3003;
app.use(morgan('dev'));


// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Successfully connected to MySQL DB');
//   }
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
