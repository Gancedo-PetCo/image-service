const express = require('express');
const bodyParser = require('body-parser');
const Images = require('../database-mongodb/Images.js');
const connect = require('../database-mongodb/connect.js');
const cors = require('cors');
const { removeData } = require('jquery');
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('*.js', function (req, res, next) {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.use(express.static('./react-client/dist'));


app.get('/itemImages/:itemId', function(req, res) {
  const { itemId } = req.params;

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
});

const determineValidItemData = function(itemId, itemImages) {
  if (!Array.isArray(itemImages)) {
    return 'itemImages should be an array of itemImage objects, stringified with JSON.stringfy';
  }

  for (let i = 0; i < itemImages.length; i++) {
    const validItemObjectKeys = {
      small: true,
      medium: true,
      large: true,
    };

    for (let key in itemImages[i]) {
      if (!validItemObjectKeys[key]) {
        return 'At least one itemImage object contains an invalid key';
      }

      validItemObjectKeys[key] = false;

      if (!itemImages[i][key].match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig)) {
        return 'At least one URL is not a valid URL format';
      }
    }

    for (let key in validItemObjectKeys) {
      if (validItemObjectKeys[key]) {
        return `At least one itemImage object fails to contain the key '${key}'`;
      }
    }
  }

  return null;
};

app.post('/addItemImages/:itemId', (req, res) => {
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

  const itemImages = JSON.parse(receivedItemImages);

  if (itemImages.length === 0) {
    return res.status(400).send('No itemImages present in request query params');
  }

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data) {
        res.status(400).send('Item with that itemId already exists');
      } else {
        const potentialErrorMessage = determineValidItemData(itemId, itemImages);

        if (potentialErrorMessage) {
          res.status(400).send(potentialErrorMessage);
        } else {
          Images.insertRecord({ itemId, itemImages })
            .then((data) => {
              res.status(201).send(`Item ${itemId} succesfully added to database`);
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

app.put('/updateItemImages/:itemId', (req, res) => {
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

  const itemImages = JSON.parse(receivedItemImages);

  if (itemImages.length === 0) {
    return res.status(400).send('No itemImages present in request query params');
  }

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (!data) {
        res.status(400).send(`Item with the itemId ${itemId} does not exist`);
      } else {
        const potentialErrorMessage = determineValidItemData(itemId, itemImages);

        if (potentialErrorMessage) {
          res.status(400).send(potentialErrorMessage);
        } else {
          Images.updateRecord({ itemId, itemImages })
            .then((data) => {
              res.status(201).send(`Item ${itemId} succesfully updated`);
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

app.delete('/deleteItemImages/:itemId', (req, res) => {
  const { itemId } = req.params;

  if (itemId) {
    const parsedItemId = Number.parseInt(itemId, 10);

    if (parsedItemId < 100 || !Number.isInteger(parsedItemId)) {
      return res.status(400).send('itemId invalid. Must be string representing integer number greater than 99');
    }
  }

  Images.fetchItemImages(itemId)
    .then((data) => {
      if (data) {
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

app.get('/itemImages/:itemId/mainImage', function(req, res) {
  const itemId = req.params.itemId;

  if (itemId.includes('array')) {
    const itemsInArray = itemId.substring(5);
    const itemIds = itemsInArray.split(',');

    for (let i = 0; i < itemIds.length; i++) {
      const itemIdParsed = Number.parseInt(itemIds[i], 10);

      if (itemIdParsed < 100 || itemIdParsed > 199) {
        res.status(404).send('Item IDs not valid');
        return;
      }
    }

    Images.fetchMultipleItemImages(itemIds)
      .then((data) => {
        if (data) {
          const responseData = [];
          data.forEach((item) => {
            const parsedData = {
              itemId: item.itemId,
              image: item.itemImages[0].small,
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
        if (data) {
          res.status(200).send({image: data.itemImages[0].small});
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

module.exports = app;
