const axios = require('axios');

//--------------------------
//Decide which tests to run
//--------------------------

// runTests should be true to actually test serverRPS. If running unit tests, set to false
// const runTests = true;
const runTests = false;

//For each test selected, 4 tests run. The first 3 are isolated tests where the selected
//RPS (see below for testsStorage) are run one time, over the course of a second. The fourth
// and final test is the "Stress Test" that makes the selected RPS every second for 60 seconds.
//The Stress test causes errors at high RPS that are not due to internal server errors.
//Instead, they are due to connection time outs errors. And so the ability to run only
//the first three tests can be acheived by setting skipStressTest to true
//For unit tests, set to false
const skipStressTest = false;
// const skipStressTest = true;

//First httpRequestString is for index.html. Second for API GET request. Third for API POST
//For unit tests. Use first
const httpRequestString = 'http://127.0.0.1:3003/?itemID=';
// const httpRequestString = 'http://127.0.0.1:3003/itemImages/';
// const httpRequestString = 'http://127.0.0.1:3003/addItemImages/';

//If testing POST route, second trailingHttpRequestString should be uncommented. Otherwise,
//first one should be uncommented
//For unit tests. Use first
const trailingHttpRequestString = '';
// const trailingHttpRequestString = '?itemImages=';

//Decide what Series of RPS tests you want to run
//IMPORTANT - for POST testing, you can only run one RPS test at a time
const testsStorage = new Map();
//Every test is in the form of:
//Parameter 1: String representing how many RPS are being tested
//Parameter 2: Number representing how many requests should be made per second
// testsStorage.set('1RPS', 1);
// testsStorage.set('10RPS', 10);
// testsStorage.set('100RPS', 100);
// testsStorage.set('200RPS', 200);
// testsStorage.set('350RPS', 350);
// testsStorage.set('400RPS', 400);
// testsStorage.set('450RPS', 450);
// testsStorage.set('500RPS', 500);
// testsStorage.set('600RPS', 600);
testsStorage.set('1000RPS', 1000);



//--------------------------
//Generate test boundaries
//--------------------------
const hotItems = [];

const generateHotItems = function() {
  let count = 1000;

  while (count > 0) {
    const roll = Math.ceil(Math.random() * 1000000 + 9000099);
    const hotItem = roll.toString();
    if (hotItems.indexOf(hotItem) === -1) {
      hotItems.push(hotItem);
      count--;
    }
  }
};

if (runTests && httpRequestString !== 'http://127.0.0.1:3003/addItemImages/') {
  generateHotItems();
}

//--------------------------
//Run tests
//--------------------------

const generateItemData = function(itemId) {
  return `https://images.unsplash.com/photo-${itemId}-${itemId}`;
};

let currentPOSTitemId = 10000100;

const generateQueries = function (RPS) {
  let count = RPS;
  const queries = [];
  let itemData = '';

  while (count > 0) {
    let itemId;
    if (httpRequestString !== 'http://127.0.0.1:3003/addItemImages/') {
      const roll = Math.random();

      if (roll < 0.05) {
        itemId = Math.floor(Math.random() * 9000000 + 100);
      } else {
        const index = Math.floor(Math.random() * 1000);
        itemId = hotItems[index];
      }
    } else {
      itemId = currentPOSTitemId.toString();
      currentPOSTitemId++;
      itemData = generateItemData(itemId);
    }

    queries.push(`${httpRequestString}${itemId}${trailingHttpRequestString}${itemData}`);
    count--;
  }

  return queries;
};
let errorCount = 0;

const GET = function(request) {
  axios.get(request)
    // .then((response) => {
    //   // console.log(typeof(response.data));
    // })
    .catch((err) => {
      if (err) {
        console.log(err);
        errorCount++;
        console.log(errorCount);
      }
    });
};

const POST = function(request) {
  axios.post(request)
    // .then((response) => {
    //   // console.log(typeof(response.data));
    // })
    .catch((err) => {
      if (err) {
        console.log(err);
        errorCount++;
        console.log(errorCount);
      }
    });
};

const processedRequests = [];

const runIsolatedTest = function (RPS, requests) {
  let count = RPS;
  const delayBetweenRequests = 1000 / RPS;

  if (!requests) {
    requests = generateQueries(RPS);
    console.log(`Running ${RPS} RPS Isolated Test at ${new Date()}`);
  }

  while (count > 0) {
    const index = count - 1;
    if (runTests) {
      if (httpRequestString !== 'http://127.0.0.1:3003/addItemImages/') {
        setTimeout(GET.bind(null, requests[index]), delayBetweenRequests * count + 5000);
      } else {
        setTimeout(POST.bind(null, requests[index]), delayBetweenRequests * count + 5000);
      }
    } else {
      processedRequests.push(requests[index]);
    }
    count--;
  }
};

const deletePOST = function (itemId) {
  axios.delete(`http://127.0.0.1:3003/deleteItemImages/${itemId}`)
    // .then((response) => {
    //   // console.log(typeof(response.data));
    // })
    .catch((err) => {
      if (err) {
        console.log(err);
        errorCount++;
        console.log(errorCount);
      }
    });
};

const deleteCreatedPOSTs = function() {
  let count = 0;

  while (currentPOSTitemId > 10000100) {
    currentPOSTitemId--;
    setTimeout(deletePOST.bind(null, currentPOSTitemId), count * 4);
    count++;
  }
};

const runStressTest = function(RPS) {
  const testRequests = {

  };
  if(!skipStressTest) {
    let count = 60;

    while (count > 0) {
      const requests = generateQueries(RPS);
      testRequests[`test${count}Requests`] = requests;
      count--;
    }
  }

  if (runTests) {
    if(!skipStressTest) {
      console.log(`Running ${RPS} RPS Stress Test at ${new Date()}`);
      count = 60;
      while (count > 0) {
        setTimeout(runIsolatedTest.bind(null, RPS, testRequests[`test${count}Requests`]), count * 1000 + 5000);
        count--;
      }
    }
    setTimeout(deleteCreatedPOSTs, 75000);
  } else {
    return testRequests;
  }
};

const runAllTests = function() {
  const tests = [];
  const iteratorObject = testsStorage.keys();
  for (let key of iteratorObject) {
    tests.push(key);
  }

  const runTests = function(index) {
    const testName = tests[index];

    if (testName) {
      let count = 3;

      while (count > 0) {
        setTimeout(runIsolatedTest.bind(null, testsStorage.get(testName)), (count - 1) * 120000 + 10000);
        count--;
      }

      setTimeout(runStressTest.bind(null, testsStorage.get(testName)), 370000);
      setTimeout(runTests.bind(null, index + 1), 600000);
    }
  };

  setTimeout(runTests.bind(null, 0), 10000);
};

if (runTests) {
  runAllTests();
}

module.exports.hotItems = hotItems;
module.exports.generateHotItems = generateHotItems;
module.exports.generateQueries = generateQueries;
module.exports.processedRequests = processedRequests;
module.exports.runIsolatedTest = runIsolatedTest;
module.exports.runStressTest = runStressTest;
module.exports.generateItemData = generateItemData;
