const Images = require('./Images.js');

// let modifyImageData = function(imageUrls) {
//   let imageArray = [];
//   let sizesObj = {small: '54', medium: '400', large: '1000'}
//   for (let value of imageUrls) {
//     let imageObject = {};
//     for (let size in sizesObj) {
//       let parsed = url.parse(value, true);
//       parsed.query.w = sizesObj[size];
//       delete parsed.search;
//       imageObject[size] = url.format(parsed);
//     }
//     imageArray.push(imageObject);
//   }
//   return imageArray;
// }

//This function now generates a thousand randomly generated records at a time.
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

module.exports = insertImages;
