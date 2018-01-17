const express = require("express");
const db = require("./api/dao/databaseAccess");
const config = require("./config");
const morgan = require("morgan");
const app = express();

const port = process.env.PORT || 3000;

app.set('db', db);
app.set('superSecret', config.secret);
app.set("apiUrl", config.apiUrl);
app.set('salt', config.salt);

const bodyParser = require("body-parser");

const publicRoutes = require('./api/routes/publicRoutes');
const authRoutes = require('./api/routes/authenticatedRoutes');
const adminRoutes = require('./api/routes/adminRoutes');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));


publicRoutes(app);
authRoutes(app);
// adminRoutes(app);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  });
});


app.listen(port);

console.log("What the fun RESTful API server started on port : " + port);
