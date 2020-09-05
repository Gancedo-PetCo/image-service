const { fetchItemImages, fetchMultipleItemImages } = require('./Images.js');

fetchItemImages('10000099', 'images')
  .then(response => {
    console.log('MySQL good: ', response);
  });

fetchItemImages('10000099', 'imagesBad')
  .then(response => {
    console.log('MySQL bad: ', response);
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
    console.log('MySQL multiple good: ', response);
  });

fetchMultipleItemImages(arrayOfItemIds, 'imagesBad')
  .then(response => {
    console.log('MySQL multiple bad: ', response);
  });