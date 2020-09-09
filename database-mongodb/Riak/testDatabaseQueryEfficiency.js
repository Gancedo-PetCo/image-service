const {
  fetchItemImages,
  fetchMultipleItemImages,
  client,
  insertRecord,
  updateRecord,
  deleteRecord
} = require('./Images.js');

//Before testing async or sync mode, make sure to clear database cache and select a mode.
//Async and sync mode are defined as:
//Async means a call completes before the next call completes, isolating each call from each other
//Sync means calls are made one after the other based on the requestDelay, which is in milliseconds
//In both cases, the individual test functions (called by handleTests) are called independent
//of each other and so no calls between tests interfere with each other
//For both sync test modes, requestDelay also has to be uncommented
//The last mode is 'test' mode, which should be selected when running this repo's
//unit tests with the commmand >npm run test
const numberOfRandomQueries = 150;
const mode = 'async';
// const mode = 'sync';
// const requestDelay = 0; //requestDelay should be 0 in 'test' mode and greater than 0 for 'sync' mode
// const mode = 'test';

const newItemIds = [];
const newItemData = [];
const startingId = 10000100;

const generateNewItems = function() {
  let currentId = startingId;
  const endId = startingId + numberOfRandomQueries - 1;

  while (currentId <= endId) {
    newItemIds.push(currentId.toString());
    const roll = Math.ceil(Math.random() * 3);
    const itemData = new Array(roll).fill(currentId);
    const joinedData = itemData.join('XXX');
    newItemData.push(joinedData);
    currentId++;
  }
};

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

const extractCreateResponse = function(response) {
  return response.generatedKey;
};

const extractUpdateResponse = function(response) {
  return response.generatedKey;
};

const extractDeleteResponse = function(response) {
  return response;
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

const makeActualCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, extractFunction, secondDataSource = 0) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(dataSource[i], secondDataSource[i])
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
            extractFunction,
            secondDataSource
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

const makeActualUpdateCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, extractFunction, queryHandlerTwo) {
  queryHandler(dataSource[i])
    .then((response) => {
      const itemImages = extractSingleItem(response);
      if (itemImages) {
        const splitItemImages = itemImages.split('XXX');
        const newItemImages = splitItemImages.join('OOO');
        queryTimeArray[i] = [new Date().getTime()];
        return queryHandlerTwo(dataSource[i], newItemImages);
      } else {
        throw new Error('itemId not found');
      }
    })
    .then((response) => {
      dataArray.push(extractFunction(response));
      queryTimeArray[i][1] = new Date().getTime();
      if (i < numberOfRandomQueries - 1) {
        setTimeout(
          makeActualUpdateCall.bind(
            null,
            i + 1,
            dataArray,
            queryTimeArray,
            queryHandler,
            dataSource,
            extractFunction,
            queryHandlerTwo
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

const createResponseData = [];
const createResponseQueryTimes = [];
const testMySQLCreate = function(queryHandler = insertRecord) {
  console.log('create started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      createResponseData,
      createResponseQueryTimes,
      queryHandler,
      newItemIds,
      extractCreateResponse,
      newItemData
    ),
    10
  );
};

const updateResponseData = [];
const updateResponseQueryTimes = [];
const testMySQLUpdate = function(queryHandler = fetchItemImages, queryHandlerTwo = updateRecord) {
  console.log('update started');

  setTimeout(
    makeActualUpdateCall.bind(
      null,
      0,
      updateResponseData,
      updateResponseQueryTimes,
      queryHandler,
      newItemIds,
      extractUpdateResponse,
      queryHandlerTwo
    ),
    10
  );
};

const deleteResponseData = [];
const deleteResponseQueryTimes = [];
const testMySQLDelete = function(queryHandler = deleteRecord) {
  console.log('delete started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      deleteResponseData,
      deleteResponseQueryTimes,
      queryHandler,
      newItemIds,
      extractDeleteResponse
    ),
    10
  );
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
  if (mode !== 'test') {
    console.log(`


    `);
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

    let stringInsert = '';

    if (mode === 'sync') {
      stringInsert = `, a ${requestDelay} ms delay,`;
    }

    const averageSingleQueryTime = accumulatedSingleItemQueryTime / numberOfRandomQueries;
    console.log(`Average Riak query time for ${numberOfRandomQueries} queries${stringInsert} and a single ItemID lookup is ${averageSingleQueryTime} ms`);

    const averageMultiQueryTime = accumulatedMultiItemQueryTime / numberOfRandomQueries;
    console.log(`Average Riak query time for ${numberOfRandomQueries} queries${stringInsert} and an array of ItemIDs is ${averageMultiQueryTime} ms`);

    if (mode === 'async') {
      let accumulatedCreateQueryTime = 0;
      for (let i = 0; i < createResponseQueryTimes.length; i++) {
        const difference = createResponseQueryTimes[i][1] - createResponseQueryTimes[i][0];
        accumulatedCreateQueryTime += difference;
      }

      const averageCreateQueryTime = accumulatedCreateQueryTime / numberOfRandomQueries;
      console.log(`Average Create query time for ${numberOfRandomQueries} queries is ${averageCreateQueryTime} ms`);

      let accumulatedUpdateQueryTime = 0;
      for (let i = 0; i < updateResponseQueryTimes.length; i++) {
        const difference = updateResponseQueryTimes[i][1] - updateResponseQueryTimes[i][0];
        accumulatedUpdateQueryTime += difference;
      }

      const averageUpdateQueryTime = accumulatedUpdateQueryTime / numberOfRandomQueries;
      console.log(`Average Update query time for ${numberOfRandomQueries} queries is ${averageUpdateQueryTime} ms`);

      let accumulatedDeleteQueryTime = 0;
      for (let i = 0; i < deleteResponseQueryTimes.length; i++) {
        const difference = deleteResponseQueryTimes[i][1] - deleteResponseQueryTimes[i][0];
        accumulatedDeleteQueryTime += difference;
      }

      const averageDeleteQueryTime = accumulatedDeleteQueryTime / numberOfRandomQueries;
      console.log(`Average Delete query time for ${numberOfRandomQueries} queries is ${averageDeleteQueryTime} ms`);
    }

    client.stop();
  }
};

const tests = [
  testMySQLDelete,
  testMySQLUpdate,
  testMySQLCreate,
  testMySQLImagesMulti,
  testMySQLImagesSingle
];
const testsSync = [testMySQLImagesMultiSync, testMySQLImagesSingleSync];
const handleTests = function() {
  let testSuite;
  if (mode === 'async') {
    testSuite = tests;
  } else if (mode === 'sync') {
    testSuite = testsSync;
  } else {
    return;
  }

  const nextTest = testSuite.pop();

  if (nextTest) {
    setTimeout(nextTest, 1000);
  } else {
    setTimeout(analyzeResults, 1000);
  }
};

generateNewItems();
generateSingleItemData();
generateArrayItemData();
handleTests();

module.exports.singleItemData = singleItemData;
module.exports.generateSingleItemData = generateSingleItemData;
module.exports.arrayItemData = arrayItemData;
module.exports.generateArrayItemData = generateArrayItemData;
module.exports.extractSingleItem = extractSingleItem;
module.exports.makeActualCall = makeActualCall;
module.exports.makeActualCallSync = makeActualCallSync;
module.exports.singleItemResponseData = singleItemResponseData;
module.exports.singleItemResponseQueryTimes = singleItemResponseQueryTimes;
module.exports.testMySQLImagesSingle = testMySQLImagesSingle;
module.exports.testMySQLImagesSingleSync = testMySQLImagesSingleSync;
module.exports.multiItemResponseData = multiItemResponseData;
module.exports.multiItemResponseQueryTimes = multiItemResponseQueryTimes;
module.exports.testMySQLImagesMulti = testMySQLImagesMulti;
module.exports.testMySQLImagesMultiSync = testMySQLImagesMultiSync;
module.exports.analyzeResults = analyzeResults;
module.exports.handleTests = handleTests;