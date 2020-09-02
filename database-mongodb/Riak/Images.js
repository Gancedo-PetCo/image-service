const client = require('./connect.js');
const { promisifyAll } = require('bluebird');
promisifyAll(client);

function insertRecords (records) {
  const insertions = [];
  for (let i = 0; i < records.length; i++) {
    insertions.push(client.storeValueAsync({ key: records[i].itemId, bucket: 'itemImages', value: records[i].itemImages }));
  }
  return Promise.all(insertions);
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
