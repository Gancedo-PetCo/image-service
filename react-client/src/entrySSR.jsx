const ReactDOM = require('react-dom');
const App = require('./index.jsx');
const { itemImages } = require('../../config.js');

const endpoint = window.location.pathname;
const itemId = endpoint.split('/')[2];

axios.get(itemImages + itemId)
  .then((data) => {
    ReactDOM.hydrate(<App itemImages={data.data.itemImages}  />, document.getElementById('gallery'));
  })
  .catch((error) => {
    console.log(error);
  });
