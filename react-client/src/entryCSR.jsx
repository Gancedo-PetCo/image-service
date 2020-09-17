import App from './index.jsx';
import config from '../../config.js';
import axios from 'axios';
import ReactDOM from 'react-dom';

const dataFetcher = function() {
  axios.get(config.itemImages + this.props.itemId)
    .then((data) => {
      this.setState({
        itemImages: data.data.itemImages.split('XXX')
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// let itemId = '100';
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemID');
ReactDOM.render(<App itemId={itemId} dataFetcher={dataFetcher} />, document.getElementById('gallery'));