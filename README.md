# image-service

## Table of contents
1. Usage
2. CRUD API

## Usage

1. With the app's root directory set to cd in terminal, run >npm install
2. Make an API account with https://unsplash.com/documentation#creating-a-developer-account
3. In the app's root folder, there is a file titled "config.example.js". Make a duplicate of this file and rename it to "config.js". Then use the terminal to run >git status. You should not see the new config.js file listed. If you do, then the name of the file is wrong. Once the correct name of the file is confirmed, you can copy your Unsplash API key to the file.
4. You can now seed the database by running >npm run seed
5. Start server with >npm run start
6. To run tests, >npm run test

## CRUD API

The CRUD API can be found below. Each item in the API corresponds to the following rules:

:itemId -  a string version of an integer greater than 100

:itemData - JSON string of an array filled with at least one itemImage object

itemImage object - {
  small: 'valid image URL',
  medium: 'valid image URL',
  large: 'valid image URL'
}

NOTE1: For 'valid image URL', the endpoint confirms that the URL format is correct. It does not confirm that the URL leads to a valid image. That is your responsibility.
NOTE2: The expected dimensions for each photograph are, roughly, in pixels:
  small 54x54
  medium: 400x400
  large: 755x755
NOTE3: The expected dimensions are not strictly enforced and, for the 'large" dimensions in particular, can vary widely. However, it is advised to do the following two things: The first dimension is expected to to be the exact pixel amount. For the second number, you should try to get the pixels as close as possible to it.

itemImages object - {
  itemId: String representing the item's integer ID number,
  itemImages: An array filled with at least one itemImage object
}

mainImage object - {
image: URL String for the smallest image size, for the very first image found in the array you would get from GET /itemImages/:itemId
}


### CREATE

Method: POST
Endpoint: /addItemImages/:itemId?itemImages=:itemData
Response: The string: Item ${itemId} succesfully added to database


### READ

Method: GET
Endpoint: /itemImages/:itemId
Response: itemImages object


Method: GET
Endpoint: /itemImages/:itemId/mainImage
Response: mainImage object

-----Special-----
Method: GET
Endpoint: /itemImages/:itemId/mainImage
SPECIAL: For this endpoint, the :itemId can actually be an "array" of itemIds. This array is in the format array###,###,### where each ### is a valid itemId
Response: An array of slightly modified mainImage objects. Each object has the additional field: itemId: String representing the item's integer ID number

Note1: The returned array is not gauranteed to have the mainImage objects in the same order that the itemIds appear in the input "array"
-----Special-----


### UPDATE

Method: PUT
Endpoint: /addItemImages/:itemId?itemImages=:itemData
Response: The string: Item ${itemId} succesfully updated


### DELETE

Method: DELETE
Endpoint: /itemImages/:itemId
Response: The string: Item ${itemId} deleted



-----------------------------------------------------------(Everything below this line might be out of date)

This service is meant to be used with a proxy server. If that is your intended use:

- run npm install inside the photo-gallery directory to install dependencies
- make an API account with Unsplash https://unsplash.com/documentation#creating-a-developer-account
- create a config.js file in project's root folder, put the following info and add the Unsplash Access key,  to it. Example:
```
  module.exports = {
    TOKEN: YOUR_TOKEN,
    mongoUri: 'mongodb://localhost/images',
    itemImages: 'http://localhost:3003/itemImages/'
  };
```
- run `npm run seed` (to seed the database)
- run `npm test` (to test seeding script, api endpoints and react components)
- start your application with two commands, `npm run client` and `npm start`, in two separate terminal tabs

If you need to use this service as standalone:

- follow all steps above
- visit http://127.0.0.1:3003/ in a browser
- add a query string parameter `itemID` to your url. Pick itemID within the range 100 - 199.
Example: `http://127.0.0.1:3003/?itemID=103`

Endpoints:

This service has two endpoints. First one retrieves all images associated with the item. Each item image is returned in 3 sizes (54px, 400px, 1000px). To retrieve data for a specific item, navigate to:

localhost:3003/itemImages/:itemID

JSON response format:

```
{"itemId":"104","itemImages":[{"_id":"5eeff4c2c079480dcd629f1d","small":"https://images.unsplash.com/photo-1529954382468-c3b5e8371e10?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0","medium":"https://images.unsplash.com/photo-1529954382468-c3b5e8371e10?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0","large":"https://images.unsplash.com/photo-1529954382468-c3b5e8371e10?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0"},{"_id":"5eeff4c2c079480dcd629f1e","small":"https://images.unsplash.com/photo-1437957146754-f6377debe171?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0","medium":"https://images.unsplash.com/photo-1437957146754-f6377debe171?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0","large":"https://images.unsplash.com/photo-1437957146754-f6377debe171?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0"}]}

```

localhost:3003/itemImages/:itemID/mainImage/

JSON response format:

```
{"image":"https://images.unsplash.com/photo-1529954382468-c3b5e8371e10?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MjE3OH0"}

```

UNLESS the format array###,###,### is submitted where each ### is a number in string format, between 100 and 199, Then you instead get back an array filled with the same object IDs above, with the additional key of "itemId" added to each object

Proxy server integration:
To use this service with a proxy server, please add <div id="gallery"></div> in index.html of your proxy server, and please add <script type="text/javascript" src="http://localhost:3003/bundle.js"></script> near the bottom of the same file. Also you will need to place <link rel="stylesheet" href="http://localhost:3003/style.css"></link> file in the head of your html file.
