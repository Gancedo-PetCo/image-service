const gallery = {
  position: 'relative',
  width: '328px'
};

const galleryPreview = {
  position: 'absolute',
  top: '0',
  left: '345px',
  width:'340px',
  height: '409px',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: 'white',
  boxShadow: '0 0 10px 5px rgba(0,0,0,0.1)',
  zIndex: '30',
};

const galleryMainImageDiv = {
  border: '1px solid #d4dadc',
};

const galleryMainImage = {
  display: 'block',
  maxWidth: '100%',
  height: '327px',
  width: '327px',
};

const galleryZoomIconAndText = {
  textAlign: 'center',
  padding: '10px',
  marginLeft: '2px',
};

const galleryZoomIcon = {
  backgroundImage: 'url("/petcoIcons.webp")',
  backgroundPosition: '-96px -31px',
  backgroundSize: '500px',
  opacity: '0.5',
  height: '18px',
  width: '25px',
  display: 'inline-block',
};

const galleryZoomText = {
  fontSize: '0.8125em',
  color: '#656565',
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  display: 'inline-block',
  marginLeft: '-1px',
};

const gallerySmallImages = {
  marginLeft: '20px',
};

const gallerySmallImage = {
  height: '59px',
  width: '59px',
  margin: '8px 13px 1px 0px',
  border: '1px solid #d4dadc',
  cursor: 'pointer',
};

const galleryImageSelected = {
  height: '59px',
  width: '59px',
  border: '2px solid rgb(0, 88, 145)',
  margin: '7px 12px 0px 0px',
  cursor: 'pointer',
};



module.exports.gallery = gallery;
module.exports.galleryPreview = galleryPreview;
module.exports.galleryMainImageDiv = galleryMainImageDiv;
module.exports.galleryMainImage = galleryMainImage;
module.exports.galleryZoomIconAndText = galleryZoomIconAndText;
module.exports.galleryZoomIcon = galleryZoomIcon;
module.exports.galleryZoomText = galleryZoomText;
module.exports.gallerySmallImages = gallerySmallImages;
module.exports.gallerySmallImage = gallerySmallImage;
module.exports.galleryImageSelected = galleryImageSelected;
