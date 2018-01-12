const express = require("express");
const app = express();
const User = require("./api/models/userModel.js");
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const routes = require('./api/routes/userRoutes');
routes(app);

app.listen(port);

console.log("What the fun RESTful API server started on port : "+port);
