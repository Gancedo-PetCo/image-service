const express = require('express');
const bodyParser = require('body-parser');
const Images = require('../database-mongodb/Images.js');
const connect = require('../database-mongodb/connect.js')
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

app.use(express.static(__dirname + '/../react-client/dist'));


app.get('/itemImages/:itemId', function(req, res) {
  Images.fetchItemImages(req.params.itemId)
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
    })
})

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
        const responseData = []
        data.forEach((item) => {
          const parsedData = {
            itemId: item.itemId,
            image: item.itemImages[0].small,
          };

          responseData.push(parsedData);
        })
        res.status(200).send(responseData);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    })
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
    })
  }

})

module.exports = app
