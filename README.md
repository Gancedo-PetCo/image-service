# image-service

## Table of contents
1. Usage
2. CRUD API
3. Working with Riak

## Usage

1. With the app's root directory set to cd in terminal, run >npm install
2. Make an API account with https://unsplash.com/documentation#creating-a-developer-account
3. In the app's root folder, there is a file titled "config.example.js". Make a duplicate of this file and rename it to "config.js". Then use the terminal to run >git status. You should not see the new config.js file listed. If you do, then the name of the file is wrong. Once the correct name of the file is confirmed, you can copy your Unsplash API key to the file.
4. You can now seed the database by running >npm run seed. If you also want to seed MySQL, run >npm run seedMySQL.
5. Start server with >npm run start
6. Before running tests, uncomment out lines 50-60 in database-mongo/seed.test.js . These lines are commented out since this test makes an actual call to the Unsplash API. To actually run tests, >npm run test

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


## Working with Riak

Riak, as I discovered after commiting to th DB, was made my company that no longer exists. The tech was bought by another company but, already, i have found some broken links on their website and/or outdated info. Since it is hard to find info on the DB, I have included this section for the steps i folowed to use Riak.

1. For MacOs, i followed the instructions found here https://docs.riak.com/riak/kv/2.2.3/setup/installing/mac-osx/index.html

I followed the "From Precompiled Tarballs" instructions. Note that I would not recommend following these instructions exactly and so the next few steps below will tell you what to do.

2. Open a FRESH terminal window and then >curl -O http://s3.amazonaws.com/downloads.basho.com/riak/2.2/2.2.3/osx/10.8/riak-2.2.3-OSX-x86_64.tar.gz

3. The command in point 2 will initiate a download of the precompiled tarballs. Once it completes you can install the tarballs with: (in the same terminal window) >tar xzvf riak-2.2.3-osx-x86_64.tar.gz

4. At this point, the tarballs have been installed. The reason I wanted a FRESH teminal window is so, hopefully, Riak would be installed directly in your home folder. This is the folder terminal defaults to when first opened. Also, I do not know how the command in Step 3 operates. As in, if it always installs in your home directory or if installs in whatever folder you terminal is cd to. To be safe, use a fresh terminal.

Once the tarballs are installed, the next set of instructions in the official Riak instructions should NOT BE followed. Those instructions have you firing up your Riak node. However, if you want to rename your Riak node and you already fired up the node, you have to first stop it and then go through a file deletion process before you can actually do so. Very irresponsible to tell you to fire up the Riak node without first warning you certain configuration options are hard to change if you already fired it up. Instead, proceed to Step 5.

5. The Riak folder you should be in your hom directory if you followed all the steps exactly. Officially the folder will be labelled riak-version. For mine, the version was 2.2.3 and so my folder is titled riak-2.2.3. In that folder, you can find the config file at /etc/riak.conf

Open this file with a text editor and then make the following changes:

nodename = riaktest@127.0.0.1 (from riak@127.0.0.1)

ring_size = 8 (from 64)

Storage_backend = leveldb (from bitcask)

leveldb.maximum_memory.percent = 5 (from 70)

leveldb.compression = off (from on)

buckets.default.n_val = 1 (from 3)

NOTE1: Since there is more than one way to alter the config for Riak, some of the lines you alter might have ## to comment out that line. You will have to delete those ## on just the line you altered for the cahnge to take effect.

NOTE2: for the last config variable (buckets.default.n_val), you will have to manually add it at the bottom of the config file since it isn't already listed there.

NOTE3: If you want to read explanations for each config change, you can see my engineering journal at https://docs.google.com/document/d/1Un5qGx6VMAYrafG-_iP8LWG7ENGys1yWpatvlokr-Bc/edit

6. After you edit and save the config file, before you start up the Riak node, you will need to change the number of max files a program is allowed to open on your computer. You can do with >sudo launchctl limit maxfiles softLimit hardLimit. Riak expects the softLimit and hardLimit to be at least 65536 and I have been using this exact command: >sudo launchctl limit maxfiles 70000 70000

You can check that the change took effect with >launchctl limit maxfiles

Note that when you finally fire up Riak, it might complain that the maxfiles limit you just changed is set too low, even though you just changed it. I do not know if this is a bug or not, nor do I know how to check if Riak is sending the warning but is actually benefiting from the change you just made. All I know is Riak seemed to work fine for me.

Also note that the change to the maxfiles limit is only temporary. When you log out or shutdown your comp and relog in, the change will have reverted. There is a way to make this change permanent but I would not advise this since it grants ANY program this new limit. Only if you are running Riak on a dedicated server box would I suggest making this change permanent.

7. You can now fire up the Riak node following the instructions I told you not to follow earlier. However, i would suggest making it so that you don't have to cd into that folder anytime. Rather, there is a way to manually make it to you can riak commands anywhere from in terminal. Similar to how you can run git, npm, etc commands anywhere from in terminal. To do that (note that the instructions are for the Catalina OS. If yours is different, you will have to research "adding to PATH operating system". Most likely, it will just be the file name in step c that is different but it could be all instructions):
a. open a fresh terminal window or, in the terminal window you have now, type >cd ~/    Either way, you will be back in your home folder as cd.
b. >ls -a
c. The last command will list everything currently in your home directory. Look for a file titled .zprofile. If it exists, proceed to step d. Otherwise, create it with >touch .zprofile
d. Once you open .zprofile in a text editor, copy this line into it:
export PATH=$PATH:/Users/nzabalza/riak-2.2.3/bin
and make the necessary changes for you comp's file system.

The copied line takes the exisitng PATH (acquired with $PATH) and tacks on the path to Riak's command line interface to it. Note that you have to separate all the paths in PATH with : and so don't forget that colon.

Also note that the path you are adding is not absolute from the location of your home directory, even though the .zprofile is in your home directory. Rather it is absolute from your harddrive which is why my path is /Users/nzabalza/riak-2.2.3/bin rather than /riak-2.2.3/bin

e. One you save the changes to .zprofile they won't take effect right away since terminal loads .zprofile upon start up. So you will need a FRESH terminla window before mocing on to Step 8.

8. If you correctly added the Riak CLI to your computer's PATH variable, then you can now run riak commands from anywhere in terminal, no matter wher you are cd. To start the node, run >riak start

If it doesn't start and errors out after 10 or so seconds, you might have made a mistake while altering  the config. You can check your config with >riak chkconfig

9. Yes, you will have to manually start your Riak node with >riak start everytime you log in.
10. You can now seed your Riak node by cd into this project's root folder and running >npm run seedRiak. (Assuming of course you set up your config.js file correctly as mentioned in the Usage section above)
11. To confirm the seeding worked, you can use Postman or curl to visit http://127.0.0.1:8098/buckets/itemImages/keys/100

You can also change the 100 to any value between 100-2099 since the seeding script is currently set to generate 200 records. You should recieve a string back that is not "not found" or some similar error message.



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
