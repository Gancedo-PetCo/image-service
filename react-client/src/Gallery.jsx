const React = require('react');
const {
  gallery,
  galleryPreview,
  galleryMainImageDiv,
  galleryMainImage,
  galleryZoomIconAndText,
  galleryZoomIcon,
  galleryZoomText,
  gallerySmallImages,
  gallerySmallImage,
  galleryImageSelected,
} = require('./CSS.js');

const beginningURL = 'https://images.unsplash.com/photo-';
const middleURL = '?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=';
const endURL = '&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0';

const Gallery = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: this.props.itemImages[0],
      x: null,
      y: null,
      preview: false
    };
  }

  onImageClick (image, id) {
    document.getElementById(id).style.borderColor = 'rgb(0, 88, 145)';
    this.setState({
      currentImage: image
    });
  }

  onImageMouseOver(id) {
    const target = document.getElementById(id);
    const classNames = target.className;

    if (!classNames.includes('galleryImageSelected')) {
      target.style.borderColor = '#969b9e';
    }
  }

  onImageMouseOut (id) {
    const target = document.getElementById(id);
    const classNames = target.className;

    if (!classNames.includes('galleryImageSelected')) {
      target.style.borderColor = '#d4dadc';
    }
  }

  getPosition() {
    return `${-this.state.x * 3.06 + 170}px ${-this.state.y * 3.06 + 205}px`;
  }

  handleMouseEnter(e) {
    this.setState({
      preview: true,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }

  handleMouseMove(e) {
    this.setState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }

  handleMouseLeave(e) {
    this.setState({
      x: null,
      y: null,
      preview: false
    });
  }

  render() {
    const { preview, x, y } = this.state;
    const previewParsed = [];

    if (preview && x && y) {
      const newStyle = Object.assign({}, galleryPreview);
      newStyle.background = `no-repeat url('${beginningURL}${this.state.currentImage}${middleURL}1000${endURL}') ${-x * 3.06 + 170}px ${-y * 3.06 + 305}px`;
      previewParsed.push(<div className="galleryPreview" style={newStyle}></div>);
    }

    return (
      <div className="gallery" style={gallery}>
        <div className="galleryMainImageDiv" style={galleryMainImageDiv}>
          <img
            className="galleryMainImage"
            src={`${beginningURL}${this.state.currentImage}${middleURL}400${endURL}`}
            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseMove={this.handleMouseMove.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            style={galleryMainImage}
          />
        </div>
        <div className="galleryZoomIconAndText" style={galleryZoomIconAndText}>
          <div className="galleryZoomIcon" style={galleryZoomIcon}></div>
          <span className="galleryZoomText" style={galleryZoomText}>Roll over image to zoom</span>
        </div>
        {previewParsed}
        <div className="gallerySmallImages" style={gallerySmallImages}>
          {this.props.itemImages.map((image, index) =>
            <img
              key={`gallery-image-${index}`}
              id={`gallerySmallImage${index}`}
              className={`gallerySmallImage
              ${this.state.currentImage === image ? "galleryImageSelected" : ""}`}
              src={`${beginningURL}${image}${middleURL}52${endURL}`}
              onClick={this.onImageClick.bind(this, image, `gallerySmallImage${index}`)}
              onMouseOver={this.onImageMouseOver.bind(this, `gallerySmallImage${index}`)}
              onMouseOut={this.onImageMouseOut.bind(this, `gallerySmallImage${index}`)}
              style={this.state.currentImage === image ? galleryImageSelected : gallerySmallImage}
            />
          )}
        </div>
      </div>
    );
  }

};

module.exports = Gallery;
