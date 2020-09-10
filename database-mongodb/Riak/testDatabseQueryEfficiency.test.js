const {
  singleItemData,
  arrayItemData,
  singleItemResponseData,
  singleItemResponseQueryTimes,
  testRiakImagesSingle,
  testRiakImagesSingleSync,
  multiItemResponseData,
  multiItemResponseQueryTimes,
  testRiakImagesMulti,
  testRiakImagesMultiSync,
  createResponseData,
  createResponseQueryTimes,
  testRiakCreate,
  updateResponseData,
  updateResponseQueryTimes,
  testRiakUpdate,
  deleteResponseData,
  deleteResponseQueryTimes,
  testRiakDelete,
  newItemIds,
  newItemData
} = require('./testDatabaseQueryEfficiency.js');

const fakeSingleItemData = [];
const fakeArrayItemData = [];
let itemIdNumber = 100;

while (fakeSingleItemData.length < 150) {
  fakeSingleItemData.push(itemIdNumber.toString());
  itemIdNumber++;
}

while (fakeArrayItemData.length < 150) {
  const arrayOfItemIds = [];
  let count = 15;

  while (count > 15) {
    arrayOfItemIds.push(itemIdNumber.toString());
    itemIdNumber++;
    count--;
  }
  fakeArrayItemData.push(arrayOfItemIds);
}

const mockSingleItemQueryHandler = function(itemId) {
  const promiseResponse = new Promise ((resolve) => {
    const buffer = Buffer.from(`${itemId} processed`, 'utf8');
    const response = { values: [{ value: buffer }] };
    setTimeout(() => { resolve(response); }, 1);
  });

  return promiseResponse;
};

const mockMultiItemQueryHandler = function(itemIds) {
  const promiseResponse = new Promise ((resolve) => {
    const arrayOfItemIds = [];
    for (let i = 0; i < itemIds.length; i++) {
      const buffer = Buffer.from(`${itemIds[i]} processed`, 'utf8');
      const response = { values: [{ value: buffer }] };
      arrayOfItemIds.push(response);
    }
    setTimeout(() => { resolve(arrayOfItemIds); }, 1);
  });

  return promiseResponse;
};

const mockCreateAndUpdateQueryHandler = function() {
  const promiseResponse = new Promise ((resolve) => {
    setTimeout(() => { resolve({ generatedKey: null }); }, 1);
  });

  return promiseResponse;
};

const mockDeleteQueryHandler = function() {
  const promiseResponse = new Promise ((resolve) => {
    setTimeout(() => { resolve(true); }, 1);
  });

  return promiseResponse;
};

//IMPORTANT NOTE! The numberOfRandomQueries has to be set to 150 for these tests to pass
describe('The testDatabaseQueryEfficiency.js script', () => {
  //the three data generation functions are generateNewItems, generateSingleItemData and generateArrayItemData
  describe('should initiate, upon exection, three data generation functions such that', () => {
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

        expect(arrayItemData).toHaveLength(150);
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
          const innerArray = arrayItemData[i];
          for (let j = 0; j < innerArray.length; j++) {
            const parsedItemId = Number.parseInt(innerArray[j], 10);
            expect(parsedItemId).toBeGreaterThanOrEqual(100);
            expect(parsedItemId).toBeLessThanOrEqual(10000099);
          }
        }
      });
    });

    describe('the newItemIds array is', () => {
      test('filled with 150 strings', () => {
        for (let i = 0; i < newItemIds.length; i++) {
          expect(typeof(newItemIds[i])).toBe('string');
        }

        expect(newItemIds).toHaveLength(150);
      });

      test('filled with strings that represent integers between 10,000,100 - 10,000,249', () => {
        for (let i = 0; i < newItemIds.length; i++) {
          const parsedItemId = Number.parseInt(newItemIds[i], 10);
          expect(parsedItemId).toBeGreaterThanOrEqual(10000100);
          expect(parsedItemId).toBeLessThanOrEqual(10000249);
        }
      });
    });

    describe('the newItemData array is', () => {
      test('filled with 150 strings', () => {
        for (let i = 0; i < newItemData.length; i++) {
          expect(typeof(newItemData[i])).toBe('string');
        }

        expect(newItemData).toHaveLength(150);
      });

      test('filled with strings that represent integers between 10,000,100 - 10,000,249, possibly joined with XXX', () => {
        for (let i = 0; i < newItemData.length; i++) {
          const splitString = newItemData[i].split('XXX');
          for (let j = 0; j < splitString.length; j++) {
            const parsedItemId = Number.parseInt(splitString[j], 10);
            expect(parsedItemId).toBeGreaterThanOrEqual(10000100);
            expect(parsedItemId).toBeLessThanOrEqual(10000249);
            if (splitString[ j - 1]) {
              const parsedPreviousItemId = Number.parseInt(splitString[j], 10);
              expect(parsedItemId).toBe(parsedPreviousItemId);
            }
          }
          expect(splitString.length).toBeGreaterThanOrEqual(1);
          expect(splitString.length).toBeLessThanOrEqual(3);
        }
      });
    });
  });

  describe('has a function testRiakImagesSingle that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill singleItemResponseData with' , () => {
      test('150 strings', (done) => {
        singleItemResponseData.splice(0, 150);
        singleItemResponseQueryTimes.splice(0, 150);
        testRiakImagesSingle(mockSingleItemQueryHandler);
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseData.length; i++) {
              expect(typeof(singleItemResponseData[i])).toBe('string');
            }

            expect(singleItemResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('strings that represent an itemId between 100-10,000,099 wirh  " processed" appended to it', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseData.length; i++) {
              const splitResponse = singleItemResponseData[i].split(' ');
              const parsedItemId = Number.parseInt(splitResponse[0], 10);
              expect(parsedItemId).toBeGreaterThanOrEqual(100);
              expect(parsedItemId).toBeLessThanOrEqual(10000099);
              expect(splitResponse[1]).toBe('processed');
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill singleItemResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseQueryTimes.length; i++) {
              expect(Array.isArray(singleItemResponseQueryTimes[i])).toBe(true);
            }

            expect(singleItemResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseQueryTimes.length; i++) {
              const tuple = singleItemResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakImagesMulti that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill multiItemResponseData with' , () => {
      test('150 arrays that, are themselves, contain 15 strings', (done) => {
        multiItemResponseData.splice(0, 150);
        multiItemResponseQueryTimes.splice(0, 150);
        testRiakImagesMulti(mockMultiItemQueryHandler);
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseData.length; i++) {
              const innerArray = multiItemResponseData[i];
              expect(Array.isArray(innerArray)).toBe(true);
              for (let j = 0; j < innerArray.length; j++) {
                expect(typeof(innerArray[j])).toBe('string');
              }
              expect(innerArray).toHaveLength(15);
            }

            expect(multiItemResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('each string in the inner array representing an itemId between 100-10,000,099 with " processed" appended to it', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseData.length; i++) {
              const innerArray = multiItemResponseData[i];
              for (let j = 0; j < innerArray.length; j++) {
                const splitResponse = innerArray[j].split(' ');
                const parsedItemId = Number.parseInt(splitResponse[0], 10);
                expect(parsedItemId).toBeGreaterThanOrEqual(100);
                expect(parsedItemId).toBeLessThanOrEqual(10000099);
                expect(splitResponse[1]).toBe('processed');
              }
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill multiItemResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseQueryTimes.length; i++) {
              expect(Array.isArray(multiItemResponseQueryTimes[i])).toBe(true);
            }

            expect(multiItemResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseQueryTimes.length; i++) {
              const tuple = multiItemResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakCreate that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill createResponseData with' , () => {
      test('null, 150 times', (done) => {
        createResponseData.splice(0, 150);
        createResponseQueryTimes.splice(0, 150);
        testRiakCreate(mockCreateAndUpdateQueryHandler);
        const tests = () => {
          if (createResponseData.length === 150) {
            for (let i = 0; i < createResponseData.length; i++) {
              expect(createResponseData[i]).toBe(null);
            }

            expect(createResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill createResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (createResponseData.length === 150) {
            for (let i = 0; i < createResponseQueryTimes.length; i++) {
              expect(Array.isArray(createResponseQueryTimes[i])).toBe(true);
            }

            expect(createResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (createResponseData.length === 150) {
            for (let i = 0; i < createResponseQueryTimes.length; i++) {
              const tuple = createResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakUpdate that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill updateResponseData with' , () => {
      test('null, 150 times', (done) => {
        updateResponseData.splice(0, 150);
        updateResponseQueryTimes.splice(0, 150);
        testRiakUpdate(mockSingleItemQueryHandler, mockCreateAndUpdateQueryHandler);
        const tests = () => {
          if (updateResponseData.length === 150) {
            for (let i = 0; i < updateResponseData.length; i++) {
              expect(updateResponseData[i]).toBe(null);
            }

            expect(updateResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill updateResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (updateResponseData.length === 150) {
            for (let i = 0; i < updateResponseQueryTimes.length; i++) {
              expect(Array.isArray(updateResponseQueryTimes[i])).toBe(true);
            }

            expect(updateResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (updateResponseData.length === 150) {
            for (let i = 0; i < updateResponseQueryTimes.length; i++) {
              const tuple = updateResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakDelete that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill deleteResponseData with' , () => {
      test('true, 150 times', (done) => {
        deleteResponseData.splice(0, 150);
        deleteResponseQueryTimes.splice(0, 150);
        testRiakDelete(mockDeleteQueryHandler);
        const tests = () => {
          if (deleteResponseData.length === 150) {
            for (let i = 0; i < deleteResponseData.length; i++) {
              expect(deleteResponseData[i]).toBe(true);
            }

            expect(deleteResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill deleteResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (deleteResponseData.length === 150) {
            for (let i = 0; i < deleteResponseQueryTimes.length; i++) {
              expect(Array.isArray(deleteResponseQueryTimes[i])).toBe(true);
            }

            expect(deleteResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (deleteResponseData.length === 150) {
            for (let i = 0; i < deleteResponseQueryTimes.length; i++) {
              const tuple = deleteResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakImagesSingleSync that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill singleItemResponseData with' , () => {
      test('150 strings', (done) => {
        singleItemResponseData.splice(0, 150);
        singleItemResponseQueryTimes.splice(0, 150);
        testRiakImagesSingleSync(mockSingleItemQueryHandler);
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseData.length; i++) {
              expect(typeof(singleItemResponseData[i])).toBe('string');
            }

            expect(singleItemResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('strings that represent an itemId between 100-10,000,099 wirh  " processed" appended to it', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseData.length; i++) {
              const splitResponse = singleItemResponseData[i].split(' ');
              const parsedItemId = Number.parseInt(splitResponse[0], 10);
              expect(parsedItemId).toBeGreaterThanOrEqual(100);
              expect(parsedItemId).toBeLessThanOrEqual(10000099);
              expect(splitResponse[1]).toBe('processed');
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill singleItemResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseQueryTimes.length; i++) {
              expect(Array.isArray(singleItemResponseQueryTimes[i])).toBe(true);
            }

            expect(singleItemResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (singleItemResponseData.length === 150) {
            for (let i = 0; i < singleItemResponseQueryTimes.length; i++) {
              const tuple = singleItemResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

  describe('has a function testRiakImagesMultiSync that', () => {
    const comparisonTimeStamp = new Date().getTime();
    describe('should, when called, fill multiItemResponseData with' , () => {
      test('150 arrays that, are themselves, contain 15 strings', (done) => {
        multiItemResponseData.splice(0, 150);
        multiItemResponseQueryTimes.splice(0, 150);
        testRiakImagesMultiSync(mockMultiItemQueryHandler);
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseData.length; i++) {
              const innerArray = multiItemResponseData[i];
              expect(Array.isArray(innerArray)).toBe(true);
              for (let j = 0; j < innerArray.length; j++) {
                expect(typeof(innerArray[j])).toBe('string');
              }
              expect(innerArray).toHaveLength(15);
            }

            expect(multiItemResponseData).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('each string in the inner array representing an itemId between 100-10,000,099 with " processed" appended to it', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseData.length; i++) {
              const innerArray = multiItemResponseData[i];
              for (let j = 0; j < innerArray.length; j++) {
                const splitResponse = innerArray[j].split(' ');
                const parsedItemId = Number.parseInt(splitResponse[0], 10);
                expect(parsedItemId).toBeGreaterThanOrEqual(100);
                expect(parsedItemId).toBeLessThanOrEqual(10000099);
                expect(splitResponse[1]).toBe('processed');
              }
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });

    describe('should, when called, fill multiItemResponseQueryTimes with' , () => {
      test('150 arrays', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseQueryTimes.length; i++) {
              expect(Array.isArray(multiItemResponseQueryTimes[i])).toBe(true);
            }

            expect(multiItemResponseQueryTimes).toHaveLength(150);
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });

      test('tuples filled with timeStamps, with the second value greater than the first', (done) => {
        const tests = () => {
          if (multiItemResponseData.length === 150) {
            for (let i = 0; i < multiItemResponseQueryTimes.length; i++) {
              const tuple = multiItemResponseQueryTimes[i];

              expect(tuple).toHaveLength(2);
              expect(tuple[0]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(comparisonTimeStamp);
              expect(tuple[1]).toBeGreaterThan(tuple[0]);
            }
            done();
          } else {
            setTimeout(tests, 100);
          }
        };
        setTimeout(tests, 1000);
      });
    });
  });

});
