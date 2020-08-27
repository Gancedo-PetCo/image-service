const unsplash = require('../helper/unsplash.js');
const insertImages = require('./insert_images.js');
const connect = require('./connect.js');
const mongoose = require('mongoose');
const Images = require('./Images.js');

const groupImageData = (urls, batch) => {
  const batchOfItemObjects = [];
  const startingItemIdForThisBatch = 1000 * batch + 100;
  const amountOfObjectItemsToBeRandomlyGenerated = 1000;
  let count = 0;

  while (count < amountOfObjectItemsToBeRandomlyGenerated) {
    const catOrDog = Math.floor(Math.random() * 2);
    let startIndex = 0;
    let endIndex = urls.length / 2;

    if (catOrDog) {
      startIndex = endIndex;
      endIndex = urls.length;
    }


    let numberOfPicturesItemHas = Math.ceil(Math.random() * 3);
    const picturesItemHas = [];

    while (numberOfPicturesItemHas > 0) {
      const randomPictureIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;
      const potentialPicture = urls[randomPictureIndex];

      if (picturesItemHas.indexOf(potentialPicture) === -1) {
        picturesItemHas.push(picturesItemHas);
        numberOfPicturesItemHas--;
      }
    }

    const itemId = (startingItemIdForThisBatch + count).toString();
    const picturesItemHasString = picturesItemHas.join('XXX');

    batchOfItemObjects.push({ itemId, picturesItemHasString });

    count++;
  }

  return batchOfItemObjects;
};

const totalNumberOfBatches = 2;
//DELETE AND UNCOMMENT
// const totalNumberOfBatches = 10000;

const insertImages = function (urls) {
  const dataInsertions = [];

  for (let i = 0; i < totalNumberOfBatches; i++) {
    const batchOfItemObjects = groupImageData(urls, i);

    dataInsertions.push(Images.insertRecords(batchOfItemObjects));
  }

  return Promise.all(dataInsertions);
};

connect()
  .then(() => {
    return unsplash.getUnsplashImages()
  })
  .then((urlsArray) => {
    return insertImages(urlsArray);
  })
  .then(() => {
      console.log('Successfully inserted images');
      mongoose.connection.close();
  })
  .catch(
    (error) => console.log(error)
  );

module.exports = insertImages;
