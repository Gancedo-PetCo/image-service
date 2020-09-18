
const express = require('express');
const bodyParser = require('body-parser');
const Images = require('../database/Images.js');
const cors = require('cors');
const server = express();
server.use(cors());
// const morgan = require('morgan');
// const NewRelic = require('newrelic');

//-------------------------
//Server Mode
//-------------------------
// const serverMode = 'CSR';
const serverMode = 'SSR';

// server.use(morgan('dev'));
server.get('/bundle.js', function (req, res, next) {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

if (serverMode === 'CSR') {
  server.use(express.static('./react-client/dist'));
} else if (serverMode === 'SSR') {
  require('@babel/register');
  const ReactDOMServer = require('react-dom/server');
  const React = require('react');
  const App = require('../react-client/src/index.jsx');

  const constructHTMLFromTemplate = function(body) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gallery</title>
      <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
      <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js"></script>
      <link rel="stylesheet" href="/style.css"></link>
    </head>
    <body>
      <div id="gallery">
        ${body}
      </div>
    </body>
    <script src="/bundle.js"></script>
    </html>
    `;
  };

  server.use(express.static('./react-client/templates'));
  server.get('/product/:itemId', (req, res) => {
    const { itemId } = req.params;

    Images.fetchItemImages(itemId)
      .then((data) => {
        if (data[0]) {
          const { itemImages } = data[0];

          const body = ReactDOMServer.renderToString(React.createElement(App, { itemImages }, null));
          const SSR = constructHTMLFromTemplate(body);
          res.status(200).send(SSR);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  });
}


server.get('/itemImages/:itemId', function(req, res) {
  const { itemId } = req.params;

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data[0]) {
        const { itemImages } = data[0];

        res.status(200).send({ itemId, itemImages });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
});

const determineValidItemData = function(itemImages) {
  const parsedItemImages = [];
  if (itemImages.length > 3) {
    return 'Too many itemImages included. Max is 3.';
  }
  for (let i = 0; i < itemImages.length; i++) {
    if (!itemImages[i].match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig)) {
      return 'At least one URL is not a valid URL format';
    }

    if (!itemImages[i].includes('images.unsplash.com/photo-')) {
      return 'At least one URL is not a Unsplash URL';
    }

    const splitItemImage = itemImages[i].split('?');
    const indexFirstDash = splitItemImage[0].indexOf('-');
    const unsplashUniqueIdentifier = splitItemImage[0].substring(indexFirstDash + 1);

    if (!unsplashUniqueIdentifier.includes('-')) {
      return 'At least one URL is not a valid Unsplash photo URL';
    }

    parsedItemImages.push(unsplashUniqueIdentifier);
  }

  return parsedItemImages;
};

server.post('/addItemImages/:itemId', (req, res) => {
  const { itemId } = req.params;
  const receivedItemImages = req.query.itemImages;

  if (itemId) {
    const parsedItemId = Number.parseInt(itemId, 10);

    if (parsedItemId < 100 || !Number.isInteger(parsedItemId)) {
      return res.status(400).send('itemId invalid. Must be string representing integer number greater than 99');
    }
  }

  if (!receivedItemImages) {
    return res.status(400).send('No itemImages present in request query params');
  }

  const itemImages = receivedItemImages.split('XXX');

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data[0]) {
        res.status(400).send('Item with that itemId already exists');
      } else {
        const potentialErrorMessage = determineValidItemData(itemImages);

        if (typeof(potentialErrorMessage) === 'string') {
          return res.status(400).send(potentialErrorMessage);
        } else {
          const itemImages = potentialErrorMessage.join('XXX');
          Images.insertRecord(itemId, itemImages)
            .then((data) => {
              res.status(201).send(`Item ${itemId} successfully added to database`);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

server.put('/updateItemImages/:itemId', (req, res) => {
  const { itemId } = req.params;
  const receivedItemImages = req.query.itemImages;

  if (itemId) {
    const parsedItemId = Number.parseInt(itemId, 10);

    if (parsedItemId < 100 || !Number.isInteger(parsedItemId)) {
      return res.status(400).send('itemId invalid. Must be string representing integer number greater than 99');
    }
  }

  if (!receivedItemImages) {
    return res.status(400).send('No itemImages present in request query params');
  }

  const itemImages = receivedItemImages.split('XXX');

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (!data[0]) {
        res.status(400).send(`Item with the itemId ${itemId} does not exist`);
      } else {
        const potentialErrorMessage = determineValidItemData(itemImages);

        if (typeof(potentialErrorMessage) === 'string') {
          return res.status(400).send(potentialErrorMessage);
        } else {
          const itemImages = potentialErrorMessage.join('XXX');
          Images.updateRecord(itemId, itemImages)
            .then((data) => {
              res.status(201).send(`Item ${itemId} successfully updated`);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

server.delete('/deleteItemImages/:itemId', (req, res) => {
  const { itemId } = req.params;

  if (itemId) {
    const parsedItemId = Number.parseInt(itemId, 10);

    if (parsedItemId < 100 || !Number.isInteger(parsedItemId)) {
      return res.status(400).send('itemId invalid. Must be string representing integer number greater than 99');
    }
  }

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data[0]) {
        Images.deleteRecord(itemId)
          .then((data) => {
            res.status(201).send(`Item ${itemId} deleted`);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
      } else {
        res.status(400).send('No item matches itemId');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

server.get('/itemImages/:itemId/mainImage', function(req, res) {
  const { itemId } = req.params;

  if (itemId.includes('array')) {
    const itemsInArray = itemId.substring(5);
    const itemIds = itemsInArray.split(',');

    for (let i = 0; i < itemIds.length; i++) {
      const itemIdParsed = Number.parseInt(itemIds[i], 10);

      if (itemIdParsed < 100) {
        res.status(404).send('At least one Item ID is not valid. Must be string representing integer number greater than 99.');
        return;
      }
    }

    Images.fetchMultipleItemImages(itemIds)
      .then((data) => {
        if (data[0]) {
          const responseData = [];
          data.forEach((item) => {
            const splitItemImages = data[0].itemImages.split('XXX');
            const parsedData = {
              itemId: item.itemId,
              image: splitItemImages[0],
            };

            responseData.push(parsedData);
          });
          res.status(200).send(responseData);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  } else {
    Images.fetchItemImages(itemId)
      .then((data) => {
        if (data[0]) {
          const splitItemImages = data[0].itemImages.split('XXX');
          res.status(200).send({ itemId, image: splitItemImages[0] });
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  }

});

module.exports = server;
