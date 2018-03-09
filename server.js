const express = require("express");
const db = require("./api/dao/databaseAccess");
const file = require("./api/dao/fileAccess");
const config = require("./config");
const morgan = require("morgan");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var multer = require('multer');
var storage = require('multer-gridfs-storage')({
    url: config.database
});
const upload = multer({ storage: storage }).single('file');

var mongoose = require("mongoose");
var grid = require('gridfs-stream');
var gridFS = grid(mongoose.connection.db, mongoose.mongo);

const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('db', db);
app.set('superSecret', config.secret);
app.set("apiUrl", config.apiUrl);
app.set('salt', config.salt);
app.set('eventReward', config.eventReward);
app.set('likeReward', config.likeReward);
app.set('commentReward', config.commentReward);
app.set('upload', upload);
app.set('gridFs', gridFS);

const bodyParser = require("body-parser");

const publicRoutes = require('./api/routes/publicRoutes');
const authRoutes = require('./api/routes/authenticatedRoutes');
const adminRoutes = require('./api/routes/adminRoutes');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.options("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //other headers here
  res.status(200).end();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type, Accept");
  next();
});

publicRoutes(app);
authRoutes(app);
adminRoutes(app);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  });
});


app.listen(port);

console.log("What the fun RESTful API server started on port : " + port);
