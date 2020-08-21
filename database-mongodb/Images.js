const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const imageSchema = new mongoose.Schema({
  itemId: String,
  itemImages: [{small: String, medium: String, large: String}]
});

const Image = mongoose.model('Image', imageSchema);

function insertRecords (records) {
  console.log("record count:", records.length);
  return Image.insertMany(records);
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
module.exports.fetchItemImages = fetchItemImages;
module.exports.fetchMultipleItemImages =fetchMultipleItemImages;
module.exports.fetchAll = fetchAll;
module.exports.deleteAll = deleteAll;
