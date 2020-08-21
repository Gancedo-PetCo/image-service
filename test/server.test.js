const insertImages = require('../database-mongodb/insert_images.js');
const Images = require('../database-mongodb/Images.js');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server/index.js');

beforeAll(() => {
  return mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => {
      return Images.deleteAll()
    })
    .then(() => {
      let imageDataForSingleItem =
      {
        itemId: '100',
        itemImages: [{small: 'https://images.unsplash.com/photo-1?w=54',
                      medium: 'https://images.unsplash.com/photo-1?w=400',
                      large: 'https://images.unsplash.com/photo-1?w=1000'},
                      {small: 'https://images.unsplash.com/photo-2?w=54',
                      medium: 'https://images.unsplash.com/photo-2?w=400',
                      large: 'https://images.unsplash.com/photo-2?w=1000'}]
      }
      return Images.insertRecords([imageDataForSingleItem])
    })
})

afterAll(() => {
  return mongoose.connection.close();
})

test('successfully retrieves image data for item 100', () => {
  return request(app).get('/itemImages/100')
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body.itemId).toBe('100');
      expect(response.body.itemImages.length).toBe(2);
      expect(response.body.itemImages[0].small).toBe('https://images.unsplash.com/photo-1?w=54');
      expect(response.body.itemImages[0].medium).toBe('https://images.unsplash.com/photo-1?w=400');
      expect(response.body.itemImages[0].large).toBe('https://images.unsplash.com/photo-1?w=1000');
      expect(response.body.itemImages[1].small).toBe('https://images.unsplash.com/photo-2?w=54');
      expect(response.body.itemImages[1].medium).toBe('https://images.unsplash.com/photo-2?w=400');
      expect(response.body.itemImages[1].large).toBe('https://images.unsplash.com/photo-2?w=1000');
    })
});

test('successfully retrieves main image url for item 100', () => {
  return request(app).get('/itemImages/100/mainImage')
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body.image).toBe('https://images.unsplash.com/photo-1?w=54')
    })
});

test('successfully retrieves main image URLs for an "array" of images', () => {
  return request(app).get('/itemImages/array123,154,100/mainImage')
    .then((response) => {
      expect(response.status).toBe(200);
    })
});

test('returns 404 status code if item not found', () => {
  return request(app).get('/itemImages/200')
    .then((response) => {
      expect(response.status).toBe(404);
    })
});

test('returns 404 status code if main image not found', () => {
  return request(app).get('/itemImages/200/mainImage')
    .then((response) => {
      expect(response.status).toBe(404);
    })
});


test('returns 404 status code if an array contains an invalid imageId', () => {
  return request(app).get('/itemImages/array123,200,100/mainImage')
    .then((response) => {
      expect(response.status).toBe(404);
    })
});
