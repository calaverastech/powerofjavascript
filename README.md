# All Javascript demo web site.
# Nodejs, Express, Jade, Socket.io, Angularjs, Karma, Protractor, Gruntjs. 

This demo project features both backend and frontend Javascript, as well as testing and running tasks with Javascript.

 [http://www.powerofjavascript.com](http://www.powerofjavascript.com)
 

## How to run it locally?

Make sure that Nodejs and npm are installed. Download Nodejs from [https://nodejs.org/en/download](https://nodejs.org/en/download) .

After cloning the project, cd to the folder and run in the Terminal

> npm install

Then start the server with:

> npm start

Open your favorite browser and point to: 

> localhost: 5001

## How to test it?

Run in the Terminal:

> grunt

It runs JSHint (detecting errors and potential problems in Javascript code), Karma unit tests and Protractor end-to-end tests. 

## Why Backend Javascript?

To get number updates every 5 seconds, the application queries the Yahoo Finances API, which allows only 2000 queries per hour. If a few users open the page simultaneously and every browser triggers a request every 5 seconds, this might be quickly exceeded. Socket.io library allows to get the data once and broadcast it to all users. 

## Why Angularjs? 

Angularjs enables fast UI-oriented front end development. 

## Why running tasks with Javascript?

Gruntjs empowers a clean, simple and efficient way to break down and run repetitive and complex series of tasks. There is a huge number of Grunt plugins available to automate standard tasks. No more mess, lost files and time waste with shell scripts!  


## License
MIT
