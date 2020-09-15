const fs = require('fs');
const axios = require('axios');
const token = require('../config.js').TOKEN;

const maxPagesToQuery = 10;
const data = [];

const extractData = (response) => {
  const { results } = response.data;
  const modifiedResults = [];

  for (let i = 0; i < results.length; i++) {
    const { regular } = results[i].urls;

    modifiedResults.push({urls: { regular }});
  }

  data.push({data: {results: modifiedResults}});
};

const getUnsplashImages = (pageNumber, urlsPerRequest, query) => {
  let options = {
    method: 'get',
    url: `https://api.unsplash.com/search/photos?query=${query}&page=${pageNumber}&per_page=${urlsPerRequest}`,
    headers: {
      'Authorization': `Client-ID ${token}`,
      'Accept-Version': 'v1'
    }
  };
  return axios(options)
    .then(extractData)
    .then(() => {
      if (pageNumber === maxPagesToQuery && query === 'puppy') {
        getUnsplashImages(1, urlsPerRequest, 'kitten');
      } else if (pageNumber === maxPagesToQuery && query === 'kitten') {
        const stringData = JSON.stringify(data);

        const dataToWrite = `module.exports = JSON.parse('${stringData}')`;

        fs.writeFileSync(`${__dirname}/unsplashData.js`, dataToWrite);
      } else {
        getUnsplashImages(pageNumber + 1, urlsPerRequest, query);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

getUnsplashImages(1, 25, 'puppy');
