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

function fetchItemImages (itemId, table) {
  const query = `SELECT itemImages FROM ${table} WHERE itemId = '${itemId}';`;
  return connection.queryAsync(query);
}

function fetchMultipleItemImages (itemIds, table) {
  let itemIdsCombinedWithMySQLSyntax = "";
  const itemIdsLength = itemIds.length - 1;

  for (let i = 0; i < itemIds.length; i++) {
    if (i === itemIdsLength) {
      itemIdsCombinedWithMySQLSyntax += `'${itemIds[i]}'`;
    } else {
      itemIdsCombinedWithMySQLSyntax += `'${itemIds[i]}',`;
    }
  }

  const query = `SELECT itemImages FROM ${table} WHERE itemId IN (${itemIdsCombinedWithMySQLSyntax});`;
  return connection.queryAsync(query);
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
