const App = require('./index.jsx');
const { itemImages } = require('../../config.js');
const axios = require('axios');
const ReactDOM = require('react-dom');

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemID');


axios.get(itemImages + itemId)
  .then((data) => {
    ReactDOM.render(<App itemImages={data.data.itemImages}/>, document.getElementById('gallery'));
  })
  .catch((error) => {
    console.log(error);
  });
