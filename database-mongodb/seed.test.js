const {
  promisesArray,
  extractURLs,
  insertImages,
  getUnsplashImages,
  handleSeeding,
} = require('./seed.js');

test('insert images', () => {
  let urlsArray = [];
  for (let i = 1; i < 301; i++) {
    urlsArray.push(`https://images.unsplash.com/photo-${i}?w=1080`)
  }
  return insertImages(urlsArray)
    .then(() => {
      return Images.fetchAll();
    })
    .then(records => {
      let dbItemIds = records.map((record) => {
        return record.itemId;
      })
      expect(dbItemIds).toHaveLength(100);
      for (let i = 100; i < 200; i++) {
        expect(dbItemIds).toContain(i.toString());
      }
      for (let record of records) {
        expect(record.itemImages).toHaveLength(3);
        for (let itemImage of record.itemImages) {
          expect(itemImage.small.startsWith('https://images.unsplash.com/photo-')).toBe(true);
          expect(itemImage.small.endsWith('?w=54')).toBe(true);
          expect(itemImage.medium.startsWith('https://images.unsplash.com/photo-')).toBe(true);
          expect(itemImage.medium.endsWith('?w=400')).toBe(true);
          expect(itemImage.large.startsWith('https://images.unsplash.com/photo-')).toBe(true);
          expect(itemImage.large.endsWith('?w=1000')).toBe(true);
        }
      }
    })
});
