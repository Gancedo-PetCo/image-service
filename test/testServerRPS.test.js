const {
  hotItems,
  generateHotItems,
  generateQueries,
  processedRequests,
  runIsolatedTest,
  runStressTest,
  generateItemData
} = require('../server/testServerRPS.js');

describe('The file testServerRPS.js has', () => {
  describe('a helper function generateHotItems that, when executed,', () => {
    test('generates 1000 items', () => {
      expect(hotItems).toHaveLength(0);
      generateHotItems();
      expect(hotItems).toHaveLength(1000);
    });

    test('generates string version of numbers between 9,000,100 - 10,000,099', () => {
      for (let i = 0; i < hotItems.length; i++) {
        const hotItem = hotItems[i];
        const parsedHotItem = Number.parseInt(hotItem, 10);
        expect(typeof(hotItem)).toBe('string');
        expect(parsedHotItem).toBeGreaterThanOrEqual(9000100);
        expect(parsedHotItem).toBeLessThanOrEqual(10000099);
      }
    });
  });

  describe('a helper function generateItemData that, when executed,', () => {
    test('generates a string', () => {
      const itemData = generateItemData('100');
      expect(typeof(itemData)).toBe('string');
    });
    //"specific format" being in the passed in value appearing twice in string,
    //separated by - and with "https://images.unsplash.com/photo-" appearing before it
    test('generates a string in a specific format', () => {
      const itemData1 = generateItemData('100');
      const itemData2 = generateItemData('5203');
      const itemData3 = generateItemData('5a2s0d3');
      const itemData4 = generateItemData('gaRgha');
      const itemData5 = generateItemData('5a2 0d3');

      expect(itemData1).toBe('https://images.unsplash.com/photo-100-100');
      expect(itemData2).toBe('https://images.unsplash.com/photo-5203-5203');
      expect(itemData3).toBe('https://images.unsplash.com/photo-5a2s0d3-5a2s0d3');
      expect(itemData4).toBe('https://images.unsplash.com/photo-gaRgha-gaRgha');
      expect(itemData5).toBe('https://images.unsplash.com/photo-5a2 0d3-5a2 0d3');
    });
  });

  describe('a helper function generateQueries that, when passed the number 100,', () => {
    test('generates an array with 100 strings', () => {
      const queries = generateQueries(100);

      expect(Array.isArray(queries)).toBe(true);
      expect(queries).toHaveLength(100);

      for (let i = 0; i < queries.length; i++) {
        expect(typeof(queries[i])).toBe('string');
      }
    });
    //"specific format" being a string in the form "http://127.0.0.1:3003/?itemID=###"
    //where ### can be any number from 100 - 10,000,099
    test('generates each string within the array to follow a specific format', () => {
      const queries = generateQueries(100);

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const parsedItemId = Number.parseInt(query.split('=')[1], 10);

        expect(query).toContain('http://127.0.0.1:3003/?itemID=');
        expect(parsedItemId).toBeGreaterThanOrEqual(100);
        expect(parsedItemId).toBeLessThanOrEqual(10000099);
      }
    });
  });

  describe('a helper function runIsolatedTest that, when passed the number 100,', () => {
    test('fills processedRequests with 100 strings', () => {
      runIsolatedTest(100);

      expect(processedRequests).toHaveLength(100);

      for (let i = 0; i < processedRequests.length; i++) {
        expect(typeof(processedRequests[i])).toBe('string');
      }
    });
    //"specific format" being a string in the form "http://127.0.0.1:3003/?itemID=###"
    //where ### can be any number from 100 - 10,000,099
    test('generates each string within the array to follow a specific format', () => {
      for (let i = 0; i < processedRequests.length; i++) {
        const query = processedRequests[i];
        const parsedItemId = Number.parseInt(query.split('=')[1], 10);

        expect(query).toContain('http://127.0.0.1:3003/?itemID=');
        expect(parsedItemId).toBeGreaterThanOrEqual(100);
        expect(parsedItemId).toBeLessThanOrEqual(10000099);
      }
    });
  });

  describe('a helper function runStressTest that, when passed the number 100,', () => {
    test('returns an object filled with 60 keys, each with an array of length 100 strings', () => {
      const allQueries = runStressTest(100);
      expect(typeof(allQueries)).toBe('object');
      expect(Array.isArray(allQueries)).toBe(false);

      let count = 0;

      for (let key in allQueries) {
        count++;

        const oneSetOfQueries = allQueries[key];
        expect(Array.isArray(oneSetOfQueries)).toBe(true);
        expect(oneSetOfQueries).toHaveLength(100);

        for (let i = 0; i < oneSetOfQueries.length; i++) {
          expect(typeof(oneSetOfQueries[i])).toBe('string');
        }
      }
      expect(count).toBe(60);
    });
    //"specific format" being a string in the form "http://127.0.0.1:3003/?itemID=###"
    //where ### can be any number from 100 - 10,000,099
    test('generates each string within the arrays to follow a specific format', () => {
      const allQueries = runStressTest(100);

      for (let key in allQueries) {
        const oneSetOfQueries = allQueries[key];
        for (let i = 0; i < oneSetOfQueries.length; i++) {
          const query = oneSetOfQueries[i];
          const parsedItemId = Number.parseInt(query.split('=')[1], 10);

          expect(query).toContain('http://127.0.0.1:3003/?itemID=');
          expect(parsedItemId).toBeGreaterThanOrEqual(100);
          expect(parsedItemId).toBeLessThanOrEqual(10000099);
        }
      }
    });
  });
});
