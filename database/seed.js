const connection = require('./connect.js');
const Images = require('./Images.js');
// const axios = require('axios');
// const token = require('../config.js').TOKEN;


const urls = [];

const extractURLs = function (responses) {
  if (urls.length === 0) {
    for (let response of responses) {
      const { results } = response.data;

      for (let result of results) {
        const { regular } = result.urls;
        const splitThatRemovesQueries = regular.split('?');
        const indexStartOfUniquePhotoId = splitThatRemovesQueries[0].indexOf('-');
        let uniquePhotoId = splitThatRemovesQueries[0].substring(indexStartOfUniquePhotoId + 1);
        urls.push(uniquePhotoId);
      }
    }
  }

  return urls;
};

const promisesArray = [];

const getUnsplashImages = (numberOfRequests, urlsPerRequest, data) => {
  if (promisesArray.length === 0) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        promisesArray.push(data[i]);
      }
    } else {
      for (let i = 1; i <= numberOfRequests; i++) {
        let options = {
          method: 'get',
          url: `https://api.unsplash.com/search/photos?query=puppy&page=${i}&per_page=${urlsPerRequest}`,
          headers: {
            'Authorization': `Client-ID ${token}`,
            'Accept-Version': 'v1'
          }
        };

        promisesArray.push(axios(options));
      }

      for (let i = 1; i <= numberOfRequests; i++) {
        let options = {
          method: 'get',
          url: `https://api.unsplash.com/search/photos?query=kitten&page=${i}&per_page=${urlsPerRequest}`,
          headers: {
            'Authorization': `Client-ID ${token}`,
            'Accept-Version': 'v1'
          }
        };

        promisesArray.push(axios(options));
      }
    }
  }

  return Promise.all(promisesArray)
    .then(extractURLs);
};

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


    let numberOfPicturesItemHas = Math.floor(Math.random() * 3) + 1;

    const picturesItemHas = [];

    while (numberOfPicturesItemHas > 0) {
      const randomPictureIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;
      const potentialPicture = urls[randomPictureIndex];

      if (picturesItemHas.indexOf(potentialPicture) === -1) {
        picturesItemHas.push(potentialPicture);
        numberOfPicturesItemHas--;
      }
    }

    const itemId = (startingItemIdForThisBatch + count).toString();
    const picturesItemHasString = picturesItemHas.join('XXX');

    batchOfItemObjects.push({ itemId, itemImages: picturesItemHasString });

    count++;
  }

  return batchOfItemObjects;
};

const insertImages = function (urls, totalNumberOfBatches, actuallyInsert, startingBatch) {
  const dataInsertions = [];

  for (let i = 0; i < totalNumberOfBatches; i++) {
    const batchOfItemObjects = groupImageData(urls, i + startingBatch);
    if (actuallyInsert) {
      dataInsertions.push(Images.insertRecords(batchOfItemObjects));
    } else {
      dataInsertions.push(batchOfItemObjects);
    }
  }

  return Promise.all(dataInsertions);
};

const handleSeeding = function(numberOfRequests, urlsPerRequest, totalNumberOfBatches, actuallyInsert, data, startingBatch) {
  return getUnsplashImages(numberOfRequests, urlsPerRequest, data)
    .then((urlsArray) => {
      return insertImages(urlsArray, totalNumberOfBatches, actuallyInsert, startingBatch);
    })
    .then(() => {
      if (startingBatch === 9990 || actuallyInsert === false) {
        connection.end();
      }

    })
    .catch((error) => console.log(error)
    );
};

module.exports.promisesArray = promisesArray;
module.exports.extractURLs = extractURLs;
module.exports.insertImages = insertImages;
module.exports.getUnsplashImages = getUnsplashImages;
module.exports.groupImageData = groupImageData;
module.exports.handleSeeding = handleSeeding;
