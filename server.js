const express = require("express");
const mongoose = require('mongoose');

const app = express();

const User = require("./api/models/userModel");
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/whatthefun");

const bodyParser = require("body-parser");

const routes = require('./api/routes/userRoutes');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


routes(app);

app.use(function(req, res){
	res.status(404).send({url: req.originalUrl+ ' not found'});
});


app.listen(port);

console.log("What the fun RESTful API server started on port : "+port);