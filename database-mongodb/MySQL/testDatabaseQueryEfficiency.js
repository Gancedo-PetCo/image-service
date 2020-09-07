const { fetchItemImages, fetchMultipleItemImages, connection } = require('./Images.js');

const numberOfRandomQueries = 150;
const mode = 'async';
// const mode = 'sync';
// const requestDelay = 10;

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
  return response[0].itemImages;
};

const extractMultipleItems = function(response) {
  const result = [];
  for (let i = 0; i < response.length; i++) {
    result.push(response[i].itemImages);
  }
  return result;
};

const makeActualCall = function(i, dataArray, queryTimeArray, queryHandler, dataSource, database, extractFunction) {
  queryTimeArray[i] = [new Date().getTime()];
  queryHandler(dataSource[i], database)
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


const singleItemResponseData = [];
const singleItemResponseQueryTimes = [];
const testMySQLImagesSingle = function() {
  console.log('singleGood started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      singleItemResponseData,
      singleItemResponseQueryTimes,
      fetchItemImages,
      singleItemData,
      'images',
      extractSingleItem
    ),
    10
  );
};

const testMySQLImagesSingleSync = function() {
  console.log('singleGood started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        singleItemResponseData,
        singleItemResponseQueryTimes,
        fetchItemImages,
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
const testMySQLImagesMulti = function() {
  console.log('multiGood started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      multiItemResponseData,
      multiItemResponseQueryTimes,
      fetchMultipleItemImages,
      arrayItemData,
      'images',
      extractMultipleItems
    ),
    10
  );
};

const testMySQLImagesMultiSync = function() {
  console.log('multiGood started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        multiItemResponseData,
        multiItemResponseQueryTimes,
        fetchMultipleItemImages,
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
const testMySQLImagesSingleBad = function() {
  console.log('singleBad started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      singleItemResponseDataBad,
      singleItemResponseQueryTimesBad,
      fetchItemImages,
      singleItemData,
      'imagesBad',
      extractSingleItem
    ),
    10
  );
};

const testMySQLImagesSingleBadSync = function() {
  console.log('singleBad started');
  for (let i = 0; i < singleItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        singleItemResponseDataBad,
        singleItemResponseQueryTimesBad,
        fetchItemImages,
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
const testMySQLImagesMultiBad = function() {
  console.log('multiBad started');

  setTimeout(
    makeActualCall.bind(
      null,
      0,
      multiItemResponseDataBad,
      multiItemResponseQueryTimesBad,
      fetchMultipleItemImages,
      arrayItemData,
      'imagesBad',
      extractMultipleItems
    ),
    10
  );
};

const testMySQLImagesMultiBadSync = function() {
  console.log('multiBad started');
  for (let i = 0; i < arrayItemData.length; i++) {
    setTimeout(
      makeActualCallSync.bind(
        null,
        i,
        multiItemResponseDataBad,
        multiItemResponseQueryTimesBad,
        fetchMultipleItemImages,
        arrayItemData[i],
        'imagesBad',
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

  connection.end();

};

const tests = [testMySQLImagesMultiBad, testMySQLImagesSingleBad, testMySQLImagesMulti, testMySQLImagesSingle];
const testsSync = [testMySQLImagesMultiBadSync, testMySQLImagesSingleBadSync, testMySQLImagesMultiSync, testMySQLImagesSingleSync];
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
