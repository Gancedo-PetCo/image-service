const {
  promisesArray,
  extractURLs,
  groupImageData,
  insertImages,
  handleSeeding,
  getUnsplashImages,
} = require('./seed.js');

const optionalData = require('../unsplashData.js');

const mockResponse1 = {
  data: {
    total: 10,
    totalPages: 2,
    results: [
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL0-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL1-moreFakeURL?bad' } },
      { urls: { small: 'badURL0', regular: 'https://images.unsplash.com/photo-fakeURL2-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL3-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL4-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL5-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL6-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL7-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL8-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL9-moreFakeURL?bad', large: 'badURL1' } },
    ],
  },
};

const mockResponse2 = {
  data: {
    total: 10,
    totalPages: 2,
    results: [
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL10-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL11-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL12-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL13-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL14-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL15-moreFakeURL?bad', medium: 'badURL2', } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL16-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL17-moreFakeURL?bad' } },
      { urls: { small: 'badURL3', regular: 'https://images.unsplash.com/photo-fakeURL18-moreFakeURL?bad' } },
      { urls: { regular: 'https://images.unsplash.com/photo-fakeURL19-moreFakeURL?bad' } },
    ],
  },
};

const mockPromisesAray = [mockResponse1, mockResponse2];

describe('The seeding script', () => {
  // test('should successfully contact the Unsplash API with four requests', () => {
  //   //The first parameter is the number of requests expected to reach the API per query.
  //   //Since there are two queries (puppy and kitten), that should total four requests.
  //   return handleSeeding(2, 10, 2, false)
  //     .then(() => {
  //       expect(promisesArray.length).toBe(4);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // });

  describe('has a helper function extractURLs that', () => {
    test('should extract only regular URLs from an Unspalsh API response', () => {
      const extractedURLs = extractURLs(mockPromisesAray);

      for (let i = 0; i < extractedURLs.length; i++) {
        const extractedURL = extractedURLs[i];
        expect(typeof(extractedURL)).toBe('string');
        expect(extractedURL).toContain('fakeURL');
        expect(extractedURLs.indexOf(extractedURL, i + 1)).toBe(-1);
      }

      expect(extractedURLs).toHaveLength(20);
    });

    test('should extract only the relevent portion of each URL', () => {
      const extractedURLs = extractURLs(mockPromisesAray);

      for (let i = 0; i < extractedURLs.length; i++) {
        const extractedURL = extractedURLs[i];
        expect(extractedURL.indexOf('bad')).toBe(-1);
        expect(extractedURL.indexOf('photo')).toBe(-1);
        expect(extractedURL).toContain('fakeURL');
        expect(extractedURL).toContain('moreFakeURL');
      }
    });
  });

  describe('has a helper function groupImageData that', () => {
    test('should generate 1000 objects', () => {
      const extractedURLs = extractURLs(mockPromisesAray);
      const generatedBatch = groupImageData(extractedURLs, 0);


      for (let i = 0; i < generatedBatch.length; i++) {
        const generatedObject = generatedBatch[i];
        expect(typeof(generatedObject)).toBe('object');
      }

      expect(generatedBatch.length).toBe(1000);
    });

    describe('should generate every object such that each object', () => {
      test('should contain the keys "itemImages" and "itemId"', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        const generatedBatch = groupImageData(extractedURLs, 0);


        for (let i = 0; i < generatedBatch.length; i++) {
          const generatedObject = generatedBatch[i];
          const keys = [];
          for (let key in generatedObject) {
            keys.push(key);
          }
          expect(keys.length).toBe(2);
          expect(keys).toContain('itemId');
          expect(keys).toContain('itemImages');
        }
      });

      test('should contain an unique "itemId" in the range 100-1099 for batch 0', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        const generatedBatch = groupImageData(extractedURLs, 0);
        let count = 100;

        for (let i = 0; i < generatedBatch.length; i++) {
          const { itemId } = generatedBatch[i];

          expect(itemId).toBe(count.toString());

          count++;
        }
        expect(generatedBatch.length).toBe(1000);
      });

      test('should contain an unique "itemId" in the range 1100-1199 for batch 1', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        const generatedBatch = groupImageData(extractedURLs, 1);
        let count = 1100;

        for (let i = 0; i < generatedBatch.length; i++) {
          const { itemId } = generatedBatch[i];

          expect(itemId).toBe(count.toString());

          count++;
        }
        expect(generatedBatch.length).toBe(1000);
      });

      test('should contain a string for "itemImages"', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        const generatedBatch = groupImageData(extractedURLs, 1);

        for (let i = 0; i < generatedBatch.length; i++) {
          const { itemImages } = generatedBatch[i];

          expect(typeof(itemImages)).toBe('string');
        }
      });

      test('should have a "itemImages" string that conforms to the standard', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        const generatedBatch = groupImageData(extractedURLs, 1);

        for (let i = 0; i < generatedBatch.length; i++) {
          const { itemImages } = generatedBatch[i];
          const splitItemImages = itemImages.split('XXX');

          expect(splitItemImages.length).toBeGreaterThanOrEqual(1);
          expect(splitItemImages.length).toBeLessThanOrEqual(3);
          for (let j = 0; j < splitItemImages.length; j++) {
            expect(extractedURLs.indexOf(splitItemImages[j])).toBeGreaterThan(-1);
          }
        }
      });
    });
  });

  describe('has a helper function insertImages that', () => {
    describe('should generate two batches of 1000 objects each when told to do so', () => {
      test('with itemIds between 100 and 2099 when passed no starting batch ID', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        return insertImages(extractedURLs, 2, false)
          .then((generatedBatches) => {
            for (let i = 0; i < generatedBatches.length; i++) {
              for (let j = 0; j > generatedBatches[i].length; j++) {
                const { itemId } = generatedBatches[i][j];
                const parsedItemID = Number.parseInt(itemId, 10);
                expect(parsedItemID).toBeGreaterThanOrEqual(100);
                expect(parsedItemID).toBeLessThanOrEqual(2099);
              }
              const generatedBatch = generatedBatches[i];
              expect(generatedBatch.length).toBe(1000);
            }

            expect(generatedBatches.length).toBe(2);
          });
      });
      //starting batch of id 2 becuse number of batches is 2
      test('with itemIds between 2100 and 4099 when passed in a starting batch ID of 2', () => {
        const extractedURLs = extractURLs(mockPromisesAray);
        return insertImages(extractedURLs, 2, false, 2)
          .then((generatedBatches) => {
            for (let i = 0; i < generatedBatches.length; i++) {
              for (let j = 0; j > generatedBatches[i].length; j++) {
                const { itemId } = generatedBatches[i][j];
                const parsedItemID = Number.parseInt(itemId, 10);
                expect(parsedItemID).toBeGreaterThanOrEqual(2100);
                expect(parsedItemID).toBeLessThanOrEqual(4099);
              }
              const generatedBatch = generatedBatches[i];
              expect(generatedBatch.length).toBe(1000);
            }

            expect(generatedBatches.length).toBe(2);
          });
      });
    });
  });

  const doesNotMatter = 'Does not matter what this is for this test';

  describe('has a helper function getUnsplashImages that, when passed in optional data', () => {
    test('fills promisesArray with 20 objects', () => {
      getUnsplashImages(doesNotMatter, doesNotMatter, optionalData);
      for (let i = 0; i < promisesArray.length; i++) {
        const object = promisesArray[i];
        expect(typeof(object)).toBe('object');
      }

      expect(promisesArray).toHaveLength(20);
    });

    test('should make every object in promisesArray have a similar structure', () => {
      const mapValidKeys = {
        data: true,
      };

      for (let i = 0; i < promisesArray.length; i++) {
        const object = promisesArray[i];

        for (let key in object) {
          expect(mapValidKeys[key]).toBe(true);
        }

        expect(typeof(object.data)).toBe('object');
        expect(object.data.results.length).toBe(25);
      }
    });
  });
});