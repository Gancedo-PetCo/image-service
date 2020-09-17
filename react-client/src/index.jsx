import React from 'react';
import Gallery from './Gallery.jsx';



class App extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.itemImages) {
      const splitItemImages = this.props.itemImages.split('XXX');
      this.state = {
        itemImages: splitItemImages
      };
    } else {
      this.state = {
        itemImages: []
      };
    }
  }

  componentDidMount () {
    if (this.props.dataFetcher) {
      this.props.dataFetcher.call(this);
    }
  }

  render() {
    return (
      <div>
        {this.state.itemImages.length > 0 && <Gallery itemImages={this.state.itemImages}/>}
      </div>
    );
  }
}

export default App;
