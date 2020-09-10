let fetchItemImages;
let fetchMultipleItemImages;
let connection;
let insertRecord;
let updateRecord;
let deleteRecord;

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
// const mode = 'async';
// const mode = 'sync';
const requestDelay = 2; //requestDelay should be 2 in 'test' mode and greater than 0 for 'sync' mode
const mode = 'test';

if (mode === 'async' || mode === 'sync') {
  const Images = require('./Images.js');

  fetchItemImages = Images.fetchItemImages;
  fetchMultipleItemImages = Images.fetchMultipleItemImages;
  connection = Images.connection;
  insertRecord = Images.insertRecord;
  updateRecord = Images.updateRecord;
  deleteRecord = Images.deleteRecord;
}

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
  return response.affectedRows;
};

const extractUpdateResponse = function(response) {
  return response.changedRows;
};

const extractDeleteResponse = function(response) {
  return response.affectedRows;
};

const extractSingleItem = function(response) {
  return response[0].itemImages;
};

const extractMultipleItems = function(response) {
  const result = [];
  for (let i = 0; i < response.length; i++) {
    result.push(response[i].itemImages);
  }
  return result;
};

const makeActualCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, database, extractFunction, secondDataSource = []) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(dataSource[i], database, secondDataSource[i])
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
            database,
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

const makeActualUpdateCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, database, extractFunction, queryHandlerTwo) {
  queryHandler(dataSource[i], database)
    .then((response) => {
      const { itemImages } = response[0];
      if (itemImages) {
        const splitItemImages = itemImages.split('XXX');
        const newItemImages = splitItemImages.join('OOO');
        queryTimeArray[i] = [new Date().getTime()];
        return queryHandlerTwo(dataSource[i], database, newItemImages);
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
            database,
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

const makeActualCallSync = function(i, dataArray, queryTimeArray, queryHandler, data, database, extractFunction) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(data, database)
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
      'images',
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
      'images',
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
      'images',
      extractDeleteResponse
    ),
    10
  );
};


const singleItemResponseData = [];
const singleItemResponseQueryTimes = [];
const testMySQLImagesSingle = function(queryHandler = fetchItemImages) {
  console.log('singleGood started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      singleItemResponseData,
      singleItemResponseQueryTimes,
      queryHandler,
      singleItemData,
      'images',
      extractSingleItem
    ),
    10
  );
};

const testMySQLImagesSingleSync = function(queryHandler = fetchItemImages) {
  console.log('singleGood started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        singleItemResponseData,
        singleItemResponseQueryTimes,
        queryHandler,
        singleItemData[i],
        'images',
        extractSingleItem
      ),
      requestDelay * i
    );
  }
};

const multiItemResponseData = [];
const multiItemResponseQueryTimes = [];
const testMySQLImagesMulti = function(queryHandler = fetchMultipleItemImages) {
  console.log('multiGood started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      multiItemResponseData,
      multiItemResponseQueryTimes,
      queryHandler,
      arrayItemData,
      'images',
      extractMultipleItems
    ),
    10
  );
};

const testMySQLImagesMultiSync = function(queryHandler = fetchMultipleItemImages) {
  console.log('multiGood started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        multiItemResponseData,
        multiItemResponseQueryTimes,
        queryHandler,
        arrayItemData[i],
        'images',
        extractMultipleItems
      ),
      requestDelay * i
    );
  }
};

const singleItemResponseDataBad = [];
const singleItemResponseQueryTimesBad = [];
const testMySQLImagesSingleBad = function(queryHandler = fetchItemImages) {
  console.log('singleBad started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      singleItemResponseDataBad,
      singleItemResponseQueryTimesBad,
      queryHandler,
      singleItemData,
      'imagesBad',
      extractSingleItem
    ),
    10
  );
};

const testMySQLImagesSingleBadSync = function(queryHandler = fetchItemImages) {
  console.log('singleBad started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        singleItemResponseDataBad,
        singleItemResponseQueryTimesBad,
        queryHandler,
        singleItemData[i],
        'imagesBad',
        extractSingleItem
      ),
      requestDelay * i
    );
  }
};

const multiItemResponseDataBad = [];
const multiItemResponseQueryTimesBad = [];
const testMySQLImagesMultiBad = function(queryHandler = fetchMultipleItemImages) {
  console.log('multiBad started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      multiItemResponseDataBad,
      multiItemResponseQueryTimesBad,
      queryHandler,
      arrayItemData,
      'imagesBad',
      extractMultipleItems
    ),
    10
  );
};

const testMySQLImagesMultiBadSync = function(queryHandler = fetchMultipleItemImages) {
  console.log('multiBad started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        multiItemResponseDataBad,
        multiItemResponseQueryTimesBad,
        queryHandler,
        arrayItemData[i],
        'imagesBad',
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

    let stringInsert = '';

    if (mode === 'sync') {
      stringInsert = `, a ${requestDelay} ms delay,`;
    }

    const averageSingleGoodQueryTime = accumulatedSingleItemQueryTime / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries${stringInsert} and a single ItemID lookup is ${averageSingleGoodQueryTime} ms`);

    const averageMultiGoodQueryTime = accumulatedMultiItemQueryTime / numberOfRandomQueries;
    console.log(`Average good MySQL query time for ${numberOfRandomQueries} queries${stringInsert} and an array of ItemIDs is ${averageMultiGoodQueryTime} ms`);

    const averageBadGoodQueryTime = accumulatedSingleItemQueryTimeBad / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries${stringInsert} and a single ItemID lookup is ${averageBadGoodQueryTime} ms`);

    const averageMultiBadQueryTime = accumulatedMultiItemQueryTimeBad / numberOfRandomQueries;
    console.log(`Average bad MySQL query time for ${numberOfRandomQueries} queries${stringInsert} and an array of ItemIDs is ${averageMultiBadQueryTime} ms`);

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

    connection.end();
  }

};

const tests = [
  testMySQLDelete,
  testMySQLUpdate,
  testMySQLCreate,
  testMySQLImagesMultiBad,
  testMySQLImagesSingleBad,
  testMySQLImagesMulti,
  testMySQLImagesSingle
];
const testsSync = [
  testMySQLImagesMultiBadSync,
  testMySQLImagesSingleBadSync,
  testMySQLImagesMultiSync,
  testMySQLImagesSingleSync
];
let connectionEnded = false;
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
module.exports.arrayItemData = arrayItemData;
module.exports.singleItemResponseData = singleItemResponseData;
module.exports.singleItemResponseQueryTimes = singleItemResponseQueryTimes;
module.exports.testMySQLImagesSingle = testMySQLImagesSingle;
module.exports.testMySQLImagesSingleSync = testMySQLImagesSingleSync;
module.exports.multiItemResponseData = multiItemResponseData;
module.exports.multiItemResponseQueryTimes = multiItemResponseQueryTimes;
module.exports.testMySQLImagesMulti = testMySQLImagesMulti;
module.exports.testMySQLImagesMultiSync = testMySQLImagesMultiSync;
module.exports.createResponseData = createResponseData;
module.exports.createResponseQueryTimes = createResponseQueryTimes;
module.exports.testMySQLCreate = testMySQLCreate;
module.exports.updateResponseData = updateResponseData;
module.exports.updateResponseQueryTimes = updateResponseQueryTimes;
module.exports.testMySQLUpdate = testMySQLUpdate;
module.exports.deleteResponseData = deleteResponseData;
module.exports.deleteResponseQueryTimes = deleteResponseQueryTimes;
module.exports.testMySQLDelete = testMySQLDelete;
module.exports.newItemIds = newItemIds;
module.exports.newItemData = newItemData;
