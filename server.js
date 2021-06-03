'use strict'

// require express and bodyParser
const  express = require("express");
const  bodyParser = require("body-parser");

// Import DB Connection
require("./views/db");

// create express app
const  app = express();

// Import API route
var routes = require('./api/routes/routes'); //importing route
routes(app);

// define port to run express app
const  port = process.env.PORT || 3000;

// use bodyParser middleware on express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

// Add endpoint
app.get('/', (req, res) => {
res.send("Hello World");
});

// Listen to server
app.listen(port, () => {

console.log(`Server running at http://localhost:${port}`);
});
