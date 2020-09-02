const connection = require('./connect.js');
const { promisifyAll } = require('bluebird');

promisifyAll(connection);

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected to MySQL DB');
  }
});


function insertRecords (records) {
  let insertionsParsedToMySQLSyntax = '';
  for (let i = 0; i < records.length; i++) {
    if (i !== 999) {
      insertionsParsedToMySQLSyntax = insertionsParsedToMySQLSyntax + "('" + records[i].itemId+ "','" + records[i].itemImages+ "'),";
    } else {
      insertionsParsedToMySQLSyntax = insertionsParsedToMySQLSyntax + "('" + records[i].itemId+ "','" + records[i].itemImages+ "')";
    }

  }
  const query = `INSERT INTO images (itemId,itemImages) VALUES${insertionsParsedToMySQLSyntax}`;

  return connection.queryAsync(query);
}

function insertRecord (record) {
  const newRecord = new Image(record);
  return newRecord.save();
}

function updateRecord (record) {
  return Image.findOneAndUpdate({ itemId: record.itemId }, record);
}

function deleteRecord (itemId) {
  return Image.findOneAndDelete({ itemId });
}

function fetchItemImages (itemId) {
  return Image.findOne({ itemId: itemId }, '-_id -__v');
}

function fetchMultipleItemImages (itemIds) {
  return Image.find({ itemId: { $in: itemIds }}).select('-_id -__v').exec();
}

function fetchAll() {
  return Image.find({});
}

function deleteAll() {
  return Image.remove({});
}

module.exports.insertRecords = insertRecords;
module.exports.insertRecord = insertRecord;
module.exports.updateRecord = updateRecord;
module.exports.deleteRecord = deleteRecord;
module.exports.fetchItemImages = fetchItemImages;
module.exports.fetchMultipleItemImages =fetchMultipleItemImages;
module.exports.fetchAll = fetchAll;
module.exports.deleteAll = deleteAll;