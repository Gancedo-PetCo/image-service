import React from 'react';
import { findDOMNode } from 'react-dom';

const beginningURL = 'https://images.unsplash.com/photo-';
const middleURL = '?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=';
const endURL = '&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0';

class Gallery extends React.Component {
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
    return (
      <div className="gallery">
        <div className="galleryMainImageDiv">
          <img
            className="galleryMainImage"
            src={`${beginningURL}${this.state.currentImage}${middleURL}400${endURL}`}
            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseMove={this.handleMouseMove.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
          />
        </div>
        <div className="galleryZoomIconAndText">
          <div className="galleryZoomIcon"></div>
          <span className="galleryZoomText">Roll over image to zoom</span>
        </div>
        {this.state.preview && <div
          className="galleryPreview"
          style={{backgroundImage: `url('${beginningURL}${this.state.currentImage}${middleURL}1000${endURL}')`, backgroundPosition: this.getPosition()}}></div>}
        <div className="gallerySmallImages">
          {this.props.itemImages.map((image, index) =>
            <img
              id={`gallerySmallImage${index}`}
              className={`gallerySmallImage
              ${this.state.currentImage === image ? "galleryImageSelected" : ""}`}
              src={`${beginningURL}${image}${middleURL}52${endURL}`}
              onClick={this.onImageClick.bind(this, image, `gallerySmallImage${index}`)}
              onMouseOver={this.onImageMouseOver.bind(this, `gallerySmallImage${index}`)}
              onMouseOut={this.onImageMouseOut.bind(this, `gallerySmallImage${index}`)}
            />
          )}
        </div>
      </div>
    );
  }

}

export default Gallery;
