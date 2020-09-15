import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './Gallery.jsx';
import axios from 'axios';
import config from '../../config.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemImages: []
    };
  }

  componentDidMount () {
    axios.get(config.itemImages + this.props.itemId)
      .then((data) => {
        this.setState({
          itemImages: data.data.itemImages.split('XXX')
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.itemImages.length > 0 && <Gallery itemImages={this.state.itemImages}/>}
      </div>
    );
  }
}

// let itemId = '100';
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemID');
ReactDOM.render(<App itemId={itemId}/>, document.getElementById('gallery'));
