const express = require('express');
const router = express.Router();

var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require("jsonwebtoken");

const mysql = require('mysql');
var db = require('../db/db.js');

router.get('/', (req,res) => {
  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    var decoded = jwt.verify(token, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3");
    const myID = decoded['id'];
    db.query('SELECT * FROM users WHERE id = ?',myID, async (error,results) =>{
      if (!results) {
				res.render('index',{
	        message : 'You\'re not connected.'
	      })
			} else {
        res.render('profile',{
          hapshooter : results[0].name
        })
      }
    })
  } else {
    res.render('index',{
      message : 'Hello !'
    })
  }
});

module.exports = router;
