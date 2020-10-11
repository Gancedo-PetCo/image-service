# image-service

## Table of contents
1. Usage
2. URLs and UUIS
3. CRUD API
4. Redis Installation Instructions
5. Deployment

## Usage

1. With the app's root directory set to cd in terminal, run >npm install
2. Make an API account with https://unsplash.com/documentation#creating-a-developer-account
3. In the app's root folder, there is a file titled "config.example.js". Make a duplicate of this file and rename it to "config.js". Then use the terminal to run >git status. You should not see the new config.js file listed. If you do, then the name of the file is wrong. Once the correct name of the file is confirmed, you can copy your Unsplash API key to the file. You can also update the other fields that require an update.
4. Before seeding the database, you have to run >npm run preseed. This script will make 20 Unsplash API calls (which means you're allotment per hour will be charged 20)  and may take some time to complete since the next call is not made until the previous call completes. Once that script finishes running,  you can now seed the database by running >npm run seed.
5. This project now uses Redia as a memcache. See below for instructions on how to install Redis in the section: Redis Installation Instructions. Your have to have Redis launched before continuing.
6. Before starting the server, you have to consider what mode to run it in. There is Client-side Render (CSR) mode that serves static files from react-client/dist and Server-side Render (SSR) mode that dynamically generates the HTML file and serves the remainder of the static files from react-client/templates. Default is SSR. You can switch modes by commenting in/out the appropriate serverMode lines of code near the top of server/index.js. Also, if you make any changes to the files in ./react-client/src, for them to take effect, you will have to run >npm run build
7. Start server with >npm run start
8. To run tests, >npm run test. Note that some of the tests may take ~35s or more to complete.
9. To see the service in action, first run >npm run client. Then visit http://127.0.0.1:3003/?itemID=### (CSR Mode) or http://127.0.0.1:3003/product/###  (SSR Mode) where ### can be any integer between 100-10,000,099 , no commas
10. The ability to test the server's RPS capacity is located in a file at server/testServerRPS.js. At the top of this file are several options that can be selected for tests. See the comments above each option for more info. The command to actually run these tests is >npm run testRPS. Note you will need to setup your own New Relic APM to take advantage of this feature. In server/index.js, you will also have to uncomment the line: const NewRelic = require('newrelic');

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
Endpoint: /deleteItemImages/:itemId
Response: The string: Item ${itemId} deleted


## Redis Installation Instructions

These instructions apply only to Mac users. Some parts may or may not apply to other OSs.

1. Install Redis with >brew install redis
2. The print out at the end of the install tells you where the redis config file is located and how to start the server. Most likely this will be /usr/local/etc/redis.conf and, for redis to use the alterations to soon be made in the config, the comman to launch is likely >redis-server /usr/local/etc/redis.conf (Do not launch yet  but do double-check to see if your print-out matches those here.)
3. Make the following changes in the Redis config:
-In the Snapshotting section, comment out all the “save” commands to turn off snapshotting.
-In Memory Management, uncomment “maxmemory” and set the value to 400MB
-Uncomment “maxmemory-policy” and set it to allkeys-lfu
-Uncommented “maxmemory-samples” and set it to 7
4. With those changes saved, launch the Redis server with the command mentioned in point 2 above.
5. You can now return to the  Usage section

## Deployment
This service require two deployments. One for the database and one for the service.

### MYSQL Deployment
1. If necessary, launch a fresh AWS EC2 instance with Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type, x64
2. Assign Elastic IP to instance
3. Update bashScriptDB.sh through bashScript6DB.sh (IMPORTANT: you will also be doing this for the actual Service Deployment and so make sure you are duplicating and updating the DB versions of the bashScripts.)  Examples are found in ./bashScripts. Make duplicates and remove the .example portion. Then update with relevant info. Note you need a Docker Hub account and repo to run these scripts. You also need to update bashScript2DB.sh and bashScript6DB.sh with the correct imageId after running bashScriptDB.sh

Later you will notice that MYSQL is being directly installed on the AWS EC2 instance, so why do you need Docker? For seeding. The seeding scripts are run using all of the bashScriptsDB. For now, only bashScript3DB.sh is needed for the actual MYSQL install.

4. SSH into AWS EC2 instance using bashScript3DB.sh
5. Install MYSQL 
a. >sudo su
b. >yum install mysql-server
c. When prompted, y
d. >chkconfig mysqld on
e. >service mysqld start
f. >mysqladmin -u root password 'your new password for root. Don't forget to write this down'

6. You should now be able to log into mysql with > mysql -h localhost -u root -p    and then supplying your password when prompted. Confirm this.
7. At this point, if you know the IP address(es) for any service instance(es) that will be connecting to this DB instance, you can add user(s) by following the instructions in "Adding MYSQL Users" below. Once done, exit with >exit;
8. Lastly, for DB to be useful to services, you need to seed it.
9. Install Docker on AWS EC2 instance
a. >sudo ym update -y
b. >sudo yum install -y docker
c. >sudo service docker start
d. >sudo usermod -a -G docker ec2-user
e. >exit
10. The exit command should kick you out of your SSH session. This is needed so part d can take affect and allow docker commands to run without sudo. If you SSHed with bashScript3DB.sh, then you can simply hit the up arrow key in the same terminal window and hit enter to reSSH
11. In a new terminal window, cd to project's root folder. Now is the time to update ./config.js with the IP address for the server instances the proxy will connect to. Also any MYSQL login info. See fields to know which data to update.
12. Now run bashScriptDB.sh to build image
13. Once script finishes, copy imageId to bashScript2DB.sh and bashScript6DB.sh. Save and then run bashScript2DB.sh
14. Back in the AWS EC2 SSH, log into docker with >docker login --username="your Docker Hub username, without quotes" and enter password when prompted.
15. Once bashScript2DB.sh finishes running, built image will be on Docker Hub. You can pull it to AWS EC2 instance by copying, pasting, and running code in bashScript5DB.sh into SSH shell
16. If you have a previous image for this proxy running on the AWS EC2 instance, you can use bashScript4DB.sh to stop it by first running >docker ps    and then copying/pasting old container/image Ids to appropriate fields in bashScript4DB.sh. Then copy/paste/execute bashScript4DB.sh code in SSH shell.
17.  Initiate seeding by copy/paste/execute bashScipt6.sh code into SSH shell and running it.
18. Seeding will take about an hour. You can confirm seeding went well by logging back into mysql shell and then running the following commands:
a. >USE SDC_Image_Service_MySQL_10Million;
b. >SELECT * FROM images WHERE itemID = '10000099';

You can also replace 10000099 with any number between 100 - 10000099 to spot check the rest of the DB.

19. At this point, DB should be good to go.

### Adding MYSQL Users
Adding users requires two steps. The first step involves modifying the config file and only needs to be performed once. The second step is needed EVERY TIME you need to add a new user.

Modifying Config File:
1. First you have to locate your MYSQL config file. Mine was located at  /etc/my.cnf
2. >sudo nano /etc/my.cnf
3. Add the line: bind-address=0.0.0.0
4. Save with CTRL + o   and hit enter
5. >exit
6. >service mysqld restart

Adding a user:
1. If not already, login to mysql shell  with >mysql -h localhost -u root -p    and then enter password when prompted.
2. >CREATE USER ‘root’@’Elastic IP address for service instance’ IDENTIFIED BY ‘password service uses to connect’;
3. Make sure you update your service's config.js file with the username ('root') and password you created the user with
4. Now you have to grant permissions to this user
5. >GRANT SELECT SDC_Image_Service_MySQL_10Million.images TO ‘root’@’Elastic IP address for service instance’;
6. Repeat step 5 three times by replacing SELECT with the following: UPDATE, DELETE, and INSERT.
7. Your service should now be registered and have the right permissions. You can confirm this by deploying the service with the updated config file and trying to visit it. See "Service Deployment" below for more details.

### Service Deployment
1. If necessary, launch a fresh AWS EC2 instance with Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type, x64
2. Assign Elastic IP to instance
3. Update bashScript.sh through bashScript6.sh. Examples are found in ./bashScripts. Make duplicates and remove the .example portion. Then update with relevant info. Note you need a Docker Hub account and repo to run these scripts. You also need to update bashScript2.sh and bashScript6.sh with the correct imageId after running bashScript.sh
4. SSH into AWS EC2 instance using bashScript3.sh
5. Install Redis on AWS EC2 instance
a.  >sudo yum install git -y
b. >/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
c. >sudo yum groupinstall 'Development Tools'
d. >echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> /home/ec2-user/.bash_profile
e. >eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
f. >brew install gcc
g. >brew install redis
6. After redis is done installing, it reports what terminal command to run so you can alter redis config file and which command to run to launch redis server using that config file. Mine were:
>sudo nano /home/linuxbrew/.linuxbrew/etc/redis.conf
>redis-server /home/linuxbrew/.linuxbrew/etc/redis.conf
7. Run >sudo nano /home/linuxbrew/.linuxbrew/etc/redis.conf  and then make the following changes:
a. In Snapshotting, comment out any variable that begins with "save"
b. In Memory Management, uncomment maxmemory and change to 400MB
c. In Memory Management, uncomment maxmemory-policy and change to allkeys-lfu
d. In Memory Management, uncomment maxmemory-samples and change to 7
8. Save changes in Linux format and then start server with >redis-server /home/linuxbrew/.linuxbrew/etc/redis.conf
9. Install Docker on AWS EC2 instance
a. >sudo ym update -y
b. >sudo yum install -y docker
c. >sudo service docker start
d. >sudo usermod -a -G docker ec2-user
e. >exit
10. The exit command should kick you out of your SSH session. This is needed so part d can take affect and allow docker commands to run without sudo. If you SSHed with bashScript3.sh, then you can simply hit the up arrow key in the same terminal window and hit enter to reSSH
11. In a new terminal window, cd to project's root folder. Now is the time to confirm ./config.js is updated with all the info it needs.
12. Now run bashScript.sh to build image
13. Once script finishes, copy imageId to bashScript2.sh and bashScript6.sh. Save and then run bashScript2.sh
14. Back in the AWS EC2 SSH, log into docker with >docker login --username="your Docker Hub username, without quotes" and enter password when prompted.
15. Once bashScript2.sh finishes running, built image will be on Docker Hub. You can pull it to AWS EC2 instance by copying, pasting, and running code in bashScript5.sh into SSH shell
16. If you have a previous image for this service running on the AWS EC2 instance, you can use bashScript4.sh to stop it by first running >docker ps    and then copying/pasting old container/image Ids to appropriate fields in bashScript4.sh. Then copy/paste/execute bashScript4.sh code in SSH shell.
17. Confirm the DB EC2 instance the service depends on is running and then initiate service by copy/paste/execute bashScipt6.sh code into SSH shell
18. Confirm service is running by visiting http://"IP address for AWS EC2 instance, without quotes":3003/product/### where ### can be any integer number between 100 to 10,000,099, without quotes




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
