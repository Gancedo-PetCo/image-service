const { fetchItemImages, fetchMultipleItemImages, client } = require('./Images.js');

//Before testing, make sure to clear database cache.
//Async and sync mode are defined as:
//Async means a call completes before the next call completes, isolating each call from each other
//Sync means calls are made one after the other based in the requestDelay, which is in milliseconds
//In both cases, the individual test functions (called by handleTests) are called independent
//of each other and so no calls between tests interfere with each other
const numberOfRandomQueries = 150;
const mode = 'async';
// const mode = 'sync';
// const requestDelay = 2;

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

const extractSingleItem = function(response) {
  return response.values[0].value.toString();
};

const extractMultipleItems = function(response) {
  const result = [];
  for (let i = 0; i < response.length; i++) {
    result.push(response[i].values[0].value.toString());
  }
  return result;
};

const makeActualCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, extractFunction) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(dataSource[i])
    .then((response) => {
      dataArray.push(extractFunction(response));
      queryTimeArray[i][1] = new Date().getTime();
      if (i < numberOfRandomQueries - 1) {
        setTimeout(
          makeActualCall.bind(
            null,
            i + 1,
            dataArray,
            queryTimeArray,
            queryHandler,
            dataSource,
            extractFunction
          ),
          10
        );
      } else {
        handleTests();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const makeActualCallSync = function(i, dataArray, queryTimeArray, queryHandler, data, extractFunction) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(data)
    .then((response) => {
      dataArray.push(extractFunction(response));
      queryTimeArray[i][1] = new Date().getTime();
      if (i === numberOfRandomQueries - 1) {
        handleTests();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const singleItemResponseData = [];
const singleItemResponseQueryTimes = [];
const testMySQLImagesSingle = function() {
  console.log('single started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      singleItemResponseData,
      singleItemResponseQueryTimes,
      fetchItemImages,
      singleItemData,
      extractSingleItem
    ),
    10
  );
};

const testMySQLImagesSingleSync = function() {
  console.log('single started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        singleItemResponseData,
        singleItemResponseQueryTimes,
        fetchItemImages,
        singleItemData[i],
        extractSingleItem
      ),
      requestDelay * i
    );
  }
};

const multiItemResponseData = [];
const multiItemResponseQueryTimes = [];
const testMySQLImagesMulti = function() {
  console.log('multi started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      multiItemResponseData,
      multiItemResponseQueryTimes,
      fetchMultipleItemImages,
      arrayItemData,
      extractMultipleItems
    ),
    10
  );
};

const testMySQLImagesMultiSync = function() {
  console.log('multi started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        multiItemResponseData,
        multiItemResponseQueryTimes,
        fetchMultipleItemImages,
        arrayItemData[i],
        extractMultipleItems
      ),
      requestDelay * i
    );
  }
};

const analyzeResults = function() {
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

  console.log(`


  `);

  let stringInsert = '';

  if (mode === 'sync') {
    stringInsert = `, a ${requestDelay} ms delay,`;
  }

  const averageSingleQueryTime = accumulatedSingleItemQueryTime / numberOfRandomQueries;
  console.log(`Average Riak query time for ${numberOfRandomQueries} queries${stringInsert} and a single ItemID lookup is ${averageSingleQueryTime} ms`);

  const averageMultiQueryTime = accumulatedMultiItemQueryTime / numberOfRandomQueries;
  console.log(`Average Riak query time for ${numberOfRandomQueries} queries${stringInsert} and an array of ItemIDs is ${averageMultiQueryTime} ms`);

  client.stop();
};

const tests = [testMySQLImagesMulti, testMySQLImagesSingle];
const testsSync = [testMySQLImagesMultiSync, testMySQLImagesSingleSync];
const handleTests = function() {
  let testSuite;
  if (mode === 'async') {
    testSuite = tests;
  } else {
    testSuite = testsSync;
  }

  const nextTest = testSuite.pop();

  if (nextTest) {
    setTimeout(nextTest, 1000);
  } else {
    setTimeout(analyzeResults, 1000);
  }
};

generateSingleItemData();
generateArrayItemData();
handleTests();
