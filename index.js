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
  extended: false
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
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, "/views/partials"));
hbs.registerHelper( "when",function(operand_1, operator, operand_2, options) {
  var operators = {
   'eq': function(l,r) { return l == r; },
   'noteq': function(l,r) { return l != r; },
   'gt': function(l,r) { return Number(l) > Number(r); },
   'or': function(l,r) { return l || r; },
   'and': function(l,r) { return l && r; },
   '%': function(l,r) { return (l % r) === 0; }
  }
  , result = operators[operator](operand_1,operand_2);

  if (result) return options.fn(this);
  else  return options.inverse(this);
});
//set 'views' folder as views
app.set('view engine', 'hbs');
app.set('views', 'views');
//define public Directory as accessible by everyone by making it static
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
