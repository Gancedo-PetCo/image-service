const { fetchItemImages, fetchMultipleItemImages } = require('./Images.js');

fetchItemImages('10000099', 'images')
  .then(response => {
    console.log('Riak: ', response.values[0].value.toString());
  });

const arrayOfItemIds = [
  '100',
  '1000',
  '10000',
  '100000',
  '1000000',
  '10000000',
  '500',
  '5000',
  '50000',
  '500000',
  '5000000',
  '652421',
  '10000099',
  '6562727',
  '46583'
];

fetchMultipleItemImages(arrayOfItemIds, 'images')
  .then(response => {
    for (let i = 0; i < response.length; i++) {
      console.log('Riak: ', response[i].values[0].value.toString());
    }
  });
