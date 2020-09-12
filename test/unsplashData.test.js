const data = require('../database/unsplashData.js');

describe('The unsplashAPIcall.js script generates the file unsplashData.js such that', () => {
  test('its export is an array filled with 20 objects', () => {
    expect(data.length).toBe(20);

    for (let i = 0; i < data.length; i++) {
      expect(typeof(data[i])).toBe('object');
    }
  });

  test('every object in its export contains an array at data.results, with length 25', () => {
    for (let i = 0; i < data.length; i++) {
      const { results } = data[i].data;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(25);
    }
  });

  test('every object in the data.results array to have a string at urls.regular', () => {
    for (let i = 0; i < data.length; i++) {
      const { results } = data[i].data;
      for (let i = 0; i < results.length; i++) {
        const { regular } = results[i].urls;
        expect(typeof(regular)).toBe('string');
      }
    }
  });
});