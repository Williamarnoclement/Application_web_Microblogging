const express = require('express');
const router = express.Router();

var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require("jsonwebtoken");

const mysql2 = require('mysql');
const db2 = mysql2.createConnection({
  /**host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE**/
  host: "localhost",
  user: "root",
  password: "",
  database: "hap"
});

router.get('/', (req,res) => {
  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    var decoded = jwt.verify(token, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3");
    const myID = decoded['id'];
    db2.query('SELECT * FROM users WHERE id = ?',myID, async (error,results) =>{
      if (!results) {
				res.render('index',{
	        message : 'WTF'
	      })
			} else {
        /**res.render('index',{
          hapshooter : results[0].name
        })**/
        res.redirect('home');
      }
    })
  } else {
    res.render('index',{
      message : 'Hello !'
    })
  }
});

router.get('/register', (req,res) => {
  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    res.redirect('index');
  } else {
    res.render('register');
  }
});

router.get('/logout', (req,res)=>{
  res.cookie('HapSHOT', '', {expires: new Date(0)});
  res.redirect('/');
});

router.get('/login', (req,res) => {
  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    res.redirect('index');
  } else {
    res.render('login');
  }
});

router.get('/index', (req,res) => {
  res.redirect('/');
});

router.get('/privacy', (req, res) =>{
  res.render('privacy');
});

router.get('/home', (req,res) => {
  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    var decoded = jwt.verify(token, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3");
    const myID = decoded['id'];
    db2.query('SELECT * FROM users WHERE id = ?',myID, async (error,results) =>{
      if (!results) {
				res.render('index',{
	        message : 'WTF'
	      })
			} else {
        res.render('feed',{
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
