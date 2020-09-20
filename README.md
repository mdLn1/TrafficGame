# React Traffic Game

## React.js, Node.js and Express framework tech stack, MongoDB for data storage

This app is designed for desktop use only, the CSS breaks on smaller screen.

Check the **About** page to find more information about the tools and resources used to build this app.

**Before following the steps below, please make sure you run `npm install` in both, client and root directory.**

To setup the application to properly run you need to do the following:

1. You need to create a `.env` inside the project root

2. You need to add one variables inside `.env` file,  `MONGO_CONNECTION`

3. `MONGO_CONNECTION` is the connection string that you receive from creating a cluster on [MongoDB website](https://cloud.mongodb.com/), there is a free cluster option which should suffice

4. By default the NodeJs API runs on PORT **8080**, you can change the port by adding a variable called `PORT` inside `.env` file and set it to a port number that you want the API to run on

5. If you simply want to try out the app you need to run `npm run build` inside the client directory then run `npm run start` inside the root of the project and go to `http://localhost:8080/` in your browser

## OPTIONAL - if you want to run the development environment

1. You need to uncomment the commented code inside `server.js` file regarding cors policy so that the react client can make requests to the API.

2. You need to uncomment the commented code inside `client/src/App.js` so that the API requests are set up for connections to the server running on PORT `8080`.

**Regarding MongoDB cluster configuration**
Please make sure you configured your MongoDB cluster to accept connections from your IP address.

## Image Gallery

![Desktop screenshot](https://raw.githubusercontent.com/mdLn1/TrafficGame/master/assets/desktop.PNG "web app desktop view")
