const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const server = app.listen(port, () => console.log("Server listening on port " + port));
/***************DATABASE***************/
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
//Cookie parser is used to crawl JWT_SECRET
const cookieParser = require('cookie-parser');
app.use(cookieParser());
//body parser is used
const bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
/***************ROUTES***************/
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/ot', require('./routes/profiles'));
//set API access
//Send and get messages
const postsApiRoute = require('./routes/api/posts');
app.use("/api/posts", postsApiRoute);
/***************VIEWS***************/
//set view engine HBS
app.set('view engine', 'hbs');
//set 'views' folder as views
app.set('views', 'views');
//define public Directory as accessible by everyone by making it static
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
