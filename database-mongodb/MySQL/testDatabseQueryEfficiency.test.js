const {
  singleItemData,
  arrayItemData,
  extractSingleItem,
  makeActualCall,
  makeActualCallSync,
  singleItemResponseData,
  singleItemResponseQueryTimes,
  testMySQLImagesSingle,
  testMySQLImagesSingleSync,
  multiItemResponseData,
  multiItemResponseQueryTimes,
  testMySQLImagesMulti,
  testMySQLImagesMultiSync,
  analyzeResults,
  handleTests
} = require('./testDatabaseQueryEfficiency.js');

const fakeSingleItemData = [];
const fakeArrayItemData = [];
let itemIdNumber = 100;

while (fakeSingleItemData.length < 150) {
  fakeSingleItemData.push(itemIdNumber.toString());
  itemIdNumber++;
}

while (fakeArrayItemData.length < 150) {
  const arrayOfItemIds = []
  let count = 15;

  while (count > 15) {
    arrayOfItemIds.push(itemIdNumber.toString());
    itemIdNumber++;
    count--;
  }
  fakeArrayItemData.push(arrayOfItemIds);
}

const mockSingleItemQueryHandler = function(itemId) {
  const promiseResponse = new Promise ((reject, resolve) => {
    resolve([{itemImages: `${itemId} processed`}]);
  });

  return promiseResponse;
};

let testDelay = 3000;

//IMPORTANT NOTE! The numberOfRandomQueries has to be set to 150 for these tests to pass
describe('The testDatabaseQueryEfficiency.js script', () => {
  //the two data generation funcitons are generateSingleItemData and generateArrayItemData
  describe('should initiate, upon exection, two data generation functions such that', () => {
    describe('the singleItemData array is', () => {
      test('filled with 150 strings', () => {
        for (let i = 0; i < singleItemData.length; i++) {
          expect(typeof(singleItemData[i])).toBe('string');
        }

        expect(singleItemData).toHaveLength(150);
      });

      test('filled with strings that represent integers between 100-10,000,099', () => {
        for (let i = 0; i < singleItemData.length; i++) {
          const parsedItemId = Number.parseInt(singleItemData[i], 10);
          expect(parsedItemId).toBeGreaterThanOrEqual(100);
          expect(parsedItemId).toBeLessThanOrEqual(10000099);
        }
      });
    });

    describe('the arrayItemData array is', () => {
      test('filled with 150 arrays', () => {
        for (let i = 0; i < arrayItemData.length; i++) {
            expect(Array.isArray(arrayItemData[i])).toBe(true);
          }

          expect(singleItemData).toHaveLength(150);
      });

      test('filled with arrays that, in turn, are filled with 15 strings', () => {
        for (let i = 0; i < arrayItemData.length; i++) {
          const innerArray = arrayItemData[i];
          for (let j = 0; j < innerArray.length; j++) {
            expect(typeof(innerArray[j])).toBe('string');
          }
          expect(innerArray).toHaveLength(15);
        }
      });

      test('has inner arrays with inner strings that represent integers between 100-10,000,099', () => {
        for (let i = 0; i < arrayItemData.length; i++) {
          for (let i = 0; i < arrayItemData.length; i++) {
            const innerArray = arrayItemData[i];
            for (let j = 0; j < innerArray.length; j++) {
              const parsedItemId = Number.parseInt(innerArray[j], 10);
            expect(parsedItemId).toBeGreaterThanOrEqual(100);
            expect(parsedItemId).toBeLessThanOrEqual(10000099);
            }
          }
        }
      });
    });
  });

  describe('has a function testMySQLImagesSingle that', () => {
    describe('should, when called, fill singleItemResponseData with' , () => {
      test('150 strings', async () => {
        singleItemResponseData.splice(0, 150);
        singleItemResponseQueryTimes.splice(0, 150);
        testMySQLImagesSingle(mockSingleItemQueryHandler);
        setTimeout(() => {
          for (let i = 0; i < singleItemResponseData.length; i++) {
            expect(typeof(singleItemResponseData[i])).toBe('string');
          }

          expect(singleItemResponseData).toHaveLength(150);
        }, testDelay);
      });
    });
  });
});
