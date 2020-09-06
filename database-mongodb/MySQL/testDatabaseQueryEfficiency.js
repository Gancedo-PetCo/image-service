const { fetchItemImages, fetchMultipleItemImages, connection } = require('./Images.js');

const numberOfRandomQueries = 250;
const goodQueryTime = 100;
const goodWaitTime = goodQueryTime + 50;
const badQueryTime = 4000;
const badWaitTime = badQueryTime + 1000;

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

const allCallsCompletionCheck = [];
const checkAllCallsComplete = function(promiseArray, message) {
  if (promiseArray.length === numberOfRandomQueries) {
    Promise.all(promiseArray)
      .then(() => {
        allCallsCompletionCheck.push(message);
        console.log(message);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    setTimeout(checkAllCallsComplete.bind(null, promiseArray, message), 1000);
  }
};

const makeActualCall = function(i, promiseArray, dataArray, queryTimeArray, queryHandler, data, database) {
  queryTimeArray[i] = [new Date().getTime()];
  promiseArray.push(queryHandler(data, database)
    .then((response) => {
      dataArray.push(response[0].itemImages);
      queryTimeArray[i][1] = new Date().getTime();
    })
    .catch((err) => {
      console.log(err);
    }));
};

const singleItemRequestPromises = [];
const singleItemResponseData = [];
const singleItemResponseQueryTimes = [];
const testMySQLImagesSingle = function() {
  console.log('singleGood started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(makeActualCall.bind(null, i, singleItemRequestPromises, singleItemResponseData, singleItemResponseQueryTimes, fetchItemImages, singleItemData[i], 'images'), i * goodQueryTime);
  }
  setTimeout(checkAllCallsComplete.bind(null, singleItemRequestPromises, 'singleGood calls complete'), goodQueryTime * numberOfRandomQueries + 100);
};

const multiItemRequestPromises = [];
const multiItemResponseData = [];
const multiItemResponseQueryTimes = [];
const testMySQLImagesMulti = function() {
  console.log('multiGood started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(makeActualCall.bind(null, i, multiItemRequestPromises, multiItemResponseData, multiItemResponseQueryTimes, fetchMultipleItemImages, arrayItemData[i], 'images'), i * goodQueryTime);
  }
  setTimeout(checkAllCallsComplete.bind(null, multiItemRequestPromises, 'multiGood calls complete'), goodQueryTime * numberOfRandomQueries + 100);
};

const singleItemRequestPromisesBad = [];
const singleItemResponseDataBad = [];
const singleItemResponseQueryTimesBad = [];
const testMySQLImagesSingleBad = function() {
  console.log('singleBad started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(makeActualCall.bind(null, i, singleItemRequestPromisesBad, singleItemResponseDataBad, singleItemResponseQueryTimesBad, fetchItemImages, singleItemData[i], 'imagesBad'), i * badQueryTime);
  }
  setTimeout(checkAllCallsComplete.bind(null, singleItemRequestPromisesBad, 'singleBad calls complete'), badQueryTime * numberOfRandomQueries + 1000);
};

const multiItemRequestPromisesBad = [];
const multiItemResponseDataBad = [];
const multiItemResponseQueryTimesBad = [];
const testMySQLImagesMultiBad = function() {
  console.log('multiBad started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(makeActualCall.bind(null, i, multiItemRequestPromisesBad, multiItemResponseDataBad, multiItemResponseQueryTimesBad, fetchMultipleItemImages, arrayItemData[i], 'imagesBad'), i * badQueryTime);
  }
  setTimeout(checkAllCallsComplete.bind(null, multiItemRequestPromisesBad, 'multiBad calls complete'), badQueryTime * numberOfRandomQueries + 1000);
};

const analyzeResults = function() {
  if (allCallsCompletionCheck.length === 4) {
    let accumulatedSingleItemQueryTime = 0;
    for (let i = 0; i < singleItemResponseQueryTimes.length; i++) {
      const difference = singleItemResponseQueryTimes[i][1] - singleItemResponseQueryTimes[i][0];
      accumulatedSingleItemQueryTime += difference;
    }

    let accumulatedMultiItemQueryTime = 0;
    for (let i = 0; i < multiItemResponseQueryTimes.length; i++) {
      const difference = multiItemResponseQueryTimes[i][1] - multiItemResponseQueryTimes[i][0];
      accumulatedMultiItemQueryTime += difference;
    }

    let accumulatedSingleItemQueryTimeBad = 0;
    for (let i = 0; i < singleItemResponseQueryTimesBad.length; i++) {
      const difference = singleItemResponseQueryTimesBad[i][1] - singleItemResponseQueryTimesBad[i][0];
      accumulatedSingleItemQueryTimeBad += difference;
    }

    let accumulatedMultiItemQueryTimeBad = 0;
    for (let i = 0; i < multiItemResponseQueryTimesBad.length; i++) {
      const difference = multiItemResponseQueryTimesBad[i][1] - multiItemResponseQueryTimesBad[i][0];
      accumulatedMultiItemQueryTimeBad += difference;
    }
    console.log(`




    `);

    const averageSingleGoodQueryTime = accumulatedSingleItemQueryTime / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries and a single ItemID lookup is ${averageSingleGoodQueryTime} ms`);

    const averageMultiGoodQueryTime = accumulatedMultiItemQueryTime / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries and an array of ItemIDs is ${averageMultiGoodQueryTime} ms`);

    const averageBadGoodQueryTime = accumulatedSingleItemQueryTimeBad / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries and a single ItemID lookup is ${averageBadGoodQueryTime} ms`);

    const averageMultiBadQueryTime = accumulatedMultiItemQueryTimeBad / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries and an array ItemID is ${averageMultiBadQueryTime} ms`);

    connection.end();
  } else {
    setTimeout(analyzeResults, 10000);
  }
};

const handleTests = function() {
  let queryTime = 10000;
  setTimeout(testMySQLImagesSingle, queryTime);

  queryTime += goodWaitTime * numberOfRandomQueries + 5000;
  setTimeout(testMySQLImagesMulti, queryTime);

  queryTime += goodWaitTime * numberOfRandomQueries + 5000;
  setTimeout(testMySQLImagesSingleBad, queryTime);

  queryTime += badWaitTime * numberOfRandomQueries + 10000;
  setTimeout(testMySQLImagesMultiBad, queryTime);

  queryTime += badWaitTime * numberOfRandomQueries + 10000;
  setTimeout(analyzeResults, queryTime);
};

generateSingleItemData();
generateArrayItemData();
handleTests();
