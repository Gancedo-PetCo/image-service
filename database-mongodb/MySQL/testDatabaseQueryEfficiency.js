const { fetchItemImages, fetchMultipleItemImages, connection } = require('./Images.js');

let singleGoodStartTime;
let singleGoodEndTime;
let singleBadStartTime;
let singleBadEndTime;
let multiGoodStartTime;
let multiGoodEndTime;
let multiBadStartTime;
let multiBadEndTime;

const numberOfRandomQueries = 1;

const singleItemData = [];
const generateSingleItemData = function () {
  let count = numberOfRandomQueries;

  while (count > 0) {
    const roll = Math.floor(Math.random() * 10);
    let itemId;

    if (roll === 0) {
      itemId = Math.floor(Math.random() * 999999) + 100;
    } else {
      itemId = Math.floor(Math.random() * 1000010) + 9000090;
    }
    singleItemData.push(itemId.toString());
    count--;
  }
};

const arrayItemData = [];
const generateArrayItemData = function () {
  let count = numberOfRandomQueries;

  while (count > 0) {
    let arrayOfItemIds = [];
    let numberOfItemIds = 15;
    while (numberOfItemIds > 0) {
      const roll = Math.floor(Math.random() * 10);
      let itemId;

      if (roll === 0) {
        itemId = Math.floor(Math.random() * 999999) + 100;
      } else {
        itemId = Math.floor(Math.random() * 1000010) + 9000090;
      }

      arrayOfItemIds.push(itemId.toString());
      numberOfItemIds--;
    }

    arrayItemData.push(arrayOfItemIds);
    count--;
  }
};

const singleItemResponseData = [];
const testMySQLImagesSingle = function() {
  const promiseArray = [];
  singleGoodStartTime = new Date().getTime();

  for (let i = 0; i < singleItemData.length; i++) {
    promiseArray.push(fetchItemImages(singleItemData[i], 'images')
      .then(response => {
        singleItemResponseData.push(response[0].itemImages);
      })
      .catch((err) => {
        console.log(err);
      }));
  }
  return Promise.all(promiseArray);
};

const singleItemResponseDataBad = [];
const testMySQLImagesSingleBad = function() {
  const promiseArray = [];
  singleBadStartTime = new Date().getTime();

  for (let i = 0; i < singleItemData.length; i++) {
    promiseArray.push(fetchItemImages(singleItemData[i], 'imagesBad')
      .then(response => {
        singleItemResponseDataBad.push(response[0].itemImages);
      })
      .catch((err) => {
        console.log(err);
      }));
  }
  return Promise.all(promiseArray);
};

const multiItemResponseData = [];
const testMySQLImagesMulti = function() {
  const promiseArray = [];
  multiGoodStartTime = new Date().getTime();

  for (let i = 0; i < singleItemData.length; i++) {
    promiseArray.push(fetchMultipleItemImages(singleItemData[i], 'images')
      .then(response => {
        const itemsImages = [];
        for (let i = 0; i < response.length; i++) {
          itemsImages.push(response[i].itemImages);
        }
        multiItemResponseData.push(itemsImages);
      })
      .catch((err) => {
        console.log(err);
      }));
  }
  return Promise.all(promiseArray);
};

const multiItemResponseDataBad = [];
const testMySQLImagesMultiBad = function() {
  const promiseArray = [];
  multiBadStartTime = new Date().getTime();

  for (let i = 0; i < singleItemData.length; i++) {
    promiseArray.push(fetchMultipleItemImages(singleItemData[i], 'imagesBad')
      .then(response => {
        const itemsImages = [];
        for (let i = 0; i < response.length; i++) {
          itemsImages.push(response[i].itemImages);
        }
        multiItemResponseDataBad.push(itemsImages);
      })
      .catch((err) => {
        console.log(err);
      }));
  }
  return Promise.all(promiseArray);
};


const allTests = [];

const analyzeResults = function() {
  if (allTests.length === 4) {
    const averageSingleGoodQueryTime = (singleGoodEndTime - singleGoodStartTime) / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries and a single ItemID lookup is ${averageSingleGoodQueryTime} ms`);

    const averageBadGoodQueryTime = (singleBadEndTime - singleBadStartTime) / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries and a single ItemID lookup is ${averageBadGoodQueryTime} ms`);

    const averageMultiGoodQueryTime = (multiGoodEndTime - multiGoodStartTime) / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries and an array of ItemIDs is ${averageMultiGoodQueryTime} ms`);

    const averageMultiBadQueryTime = (multiBadEndTime - multiBadStartTime) / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries and an array ItemID is ${averageMultiBadQueryTime} ms`);

    connection.end();
  } else {
    setTimeout(analyzeResults, 10000);
  }
};

const handleTests = function() {
  setTimeout(() => {
    testMySQLImagesSingle()
      .then(() => {
        singleGoodEndTime = new Date().getTime();
        allTests.push('Completed singleGood');
      })
      .catch((err) => {
        console.log(err);
      });
  }, 15000);

  setTimeout(() => {
    testMySQLImagesSingleBad()
      .then(() => {
        singleBadEndTime = new Date().getTime();
        allTests.push('Completed singleBad');
      })
      .catch((err) => {
        console.log(err);
      });
  }, 30000);

  setTimeout(() => {
    testMySQLImagesMulti()
      .then(() => {
        multiGoodEndTime = new Date().getTime();
        allTests.push('Completed multiGood');
      })
      .catch((err) => {
        console.log(err);
      });
  }, 45000);

  setTimeout(() => {
    testMySQLImagesMultiBad()
      .then(() => {
        multiBadEndTime = new Date().getTime();
        allTests.push('Completed multiBad');
      })
      .catch((err) => {
        console.log(err);
      });
  }, 60000);

  setTimeout(analyzeResults, 75000);
};

generateSingleItemData();
generateArrayItemData();
handleTests();
