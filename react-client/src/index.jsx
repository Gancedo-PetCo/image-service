const React = require('react');
const Gallery = require('./Gallery.jsx');

const App = class extends React.Component {
  constructor(props) {
    super(props);

    const splitItemImages = this.props.itemImages.split('XXX');

    this.state = {
      itemImages: splitItemImages
    };
  }

  render() {
    return (
      <div>
        {this.state.itemImages.length > 0 && <Gallery itemImages={this.state.itemImages}/>}
      </div>
    );
  }
};

module.exports = App;
