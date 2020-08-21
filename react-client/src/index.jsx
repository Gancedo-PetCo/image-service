import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './Gallery.jsx';
import $ from 'jquery';
import config from '../../config.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemImages: null
    }
  }

  componentDidMount () {
    $.ajax ({
      url: config.itemImages + this.props.itemId,
      type: "get",
      success: (data) => {
        this.setState({
          itemImages: data.itemImages
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.itemImages && <Gallery itemImages={this.state.itemImages}/>}
      </div>
    );
  }
}

// let itemId = '100';
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemID');
ReactDOM.render(<App itemId={itemId}/>, document.getElementById('gallery'));
