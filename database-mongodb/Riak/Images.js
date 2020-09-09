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

function insertRecord (itemId, itemImages) {
  return client.storeValueAsync({ key: itemId, bucket: 'itemImages', value: itemImages });
}

function updateRecord (itemId, itemImages) {
  return client.storeValueAsync({ key: itemId, bucket: 'itemImages', value: itemImages });
}

function deleteRecord (itemId) {
  return client.deleteValueAsync({ key: itemId, bucket: 'itemImages' });
}

function fetchItemImages (itemId) {
  return client.fetchValueAsync({ key: itemId, bucket: 'itemImages'});
}

function fetchMultipleItemImages (itemIds) {
  const promisesArray = [];
  for (let i = 0; i < itemIds.length; i++) {
    promisesArray.push(client.fetchValueAsync({ key: itemIds[i], bucket: 'itemImages'}));
  }
  return Promise.all(promisesArray);
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
module.exports.client = client;
