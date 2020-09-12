# image-service

## Table of contents
1. Usage
2. URLs and UUIS
3. CRUD API

## Usage

1. With the app's root directory set to cd in terminal, run >npm install
2. Make an API account with https://unsplash.com/documentation#creating-a-developer-account
3. In the app's root folder, there is a file titled "config.example.js". Make a duplicate of this file and rename it to "config.js". Then use the terminal to run >git status. You should not see the new config.js file listed. If you do, then the name of the file is wrong. Once the correct name of the file is confirmed, you can copy your Unsplash API key to the file. You can also update the other fields that require an update.
4. Before seeding the database, you have to run >npm run preseed. This script will make 20 Unsplash API calls (which means you're allotment per hour will be charged 20)  and may take some time to complete since the next call is not made until the previous call completes. Once that script finishes running,  you can now seed the database by running >npm run seed. If you also want to seed MySQL, run >npm run seedMySQL. Same for Riak and >npm run Riak. 
5. Start server with >npm run start
6. To run tests, >npm run test. Note that some of the tests may take ~35s or more to complete.

## URLs and Unsplash Unique Identifier Strings(UUIS) 

This service no longer returns full Unsplash URLs. Instead, it returns the Unsplash Unique Identifiers (UUI) used by Unsplash to identify images. Those identifiers must then be inserted into the following URL to retrieve the actual image:

https://images.unsplash.com/photo-
UUI (replace UUI with an actual UUI)
?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=
SIZE (replace SIZE with 52 400 OR 1000 which represent small, mediaum or large images)
&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0

As can be seen above, the URL has two points (UUI and SIZE) which need to be completely replaced by an acceptable value. For UUI, this is one of the UUIs returned by this service's GET requests (See Section 3 ###Read for more info). For SIZE, the service's client code uses images of three sizes and so the appropriate replacement (in horizontal pixels) is 52 400 OR 1000.

IMPORTANT: This service returns both standalone Unsplash Unique Identifiers (UUI) and Unsplash Unique Identifier Strings (UUIS), depending on the route. An example UUI is: 1517213849290-bbbfffdc6da3 

A UUIS is in the form:

UUIxxxUUIxxxUUI

In actuality the xxx are capitalized XXX since the UUI used by Unsplash are all lowercase letters and numbers. This means you can .split() the string on "XXX" to retrieve each individual UUI. If there is only one image for an item, then it will not have XXX attached to the end of it, but splitting on XXX will not error out and so this is fine.

## CRUD API

The CRUD API can be found below. Each item in the API corresponds to the following rules:

#### :itemId -  a string version of an integer greater than 100

#### :itemData - String in the form of:

VUIURLxxxVUIURLxxxVUIURL

Where VUIURL stands for Valid Unsplash Image URL and the xxx are actually capitalized XXX

NOTE1: A valid VUIURL can be obtained in one of two ways:
1. On the Unsplash site, when you are searching for photos, do NOT right-click the searched photos and copy that URL. Instead, left-click the photo, causing a modal to pop-up featuring a larger version of the photo. It is this enlarged photo that you right-click and copy the URL link from
2. Using the Unsplash API, there are several endpoints that could potentially send you back image data. In the data obect that corresponds to a particular image, there is a "urls" key whose value is an object that, itself, has multiple keys, each with a URL as its value. Any of these URLs should work but this service only gaurantees working for "regular" URLs.  
NOTE2: An item can have between one and three images. If you only submit one VUIURL, then there is no need to append XXX to it.

#### itemImages object - {
  itemId: String representing the item's integer ID number,
  itemImages: a UUIS string. See Section 2 above (URLs and Unsplash Unique Identifier Strings(UUIS)) for an explanation as to what a UUIS is
}

#### mainImage object - {
  itemId: String representing the item's integer ID number,
  image: a UUI string. See Section 2 above (URLs and Unsplash Unique Identifier Strings(UUIS)) for an explanation as to what a UUI is
}


### CREATE

Method: POST
Endpoint: /addItemImages/:itemId?itemImages=:itemData
Response: The string: Item ${itemId} successfully added to database

Note1: Recommended you use Postman to make a POST request

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
Response: An array of mainImage objects. One for each itemId in the "array" except in the case of duplicate itemIds OR itemIds that do not exist in the database.

Note1: The returned array is not gauranteed to have the mainImage objects in the same order that the itemIds appear in the input "array"

-----Special-----


### UPDATE

Method: PUT
Endpoint: /addItemImages/:itemId?itemImages=:itemData
Response: The string: Item ${itemId} successfully updated

Note1: Recommended you use Postman to make a PUT request

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
