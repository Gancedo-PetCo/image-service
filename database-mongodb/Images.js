const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const imageSchema = new mongoose.Schema({
  itemId: String,
  itemImages: String
});

const Image = mongoose.model('Image', imageSchema);

function insertRecords (records) {
  console.log("record count:", records.length);
  return Image.insertMany(records);
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

module.exports = Image;
module.exports.insertRecords = insertRecords;
module.exports.insertRecord = insertRecord;
module.exports.updateRecord = updateRecord;
module.exports.deleteRecord = deleteRecord;
module.exports.fetchItemImages = fetchItemImages;
module.exports.fetchMultipleItemImages =fetchMultipleItemImages;
module.exports.fetchAll = fetchAll;
module.exports.deleteAll = deleteAll;
