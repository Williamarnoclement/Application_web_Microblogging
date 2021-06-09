const express = require('express');
const router = express.Router();

var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require("jsonwebtoken");

const mysql2 = require('mysql');
var db2 = require('../db/db.js');

var nodemailer = require("nodemailer");

/***************MAILER***************/
let smtpTransport = nodemailer.createTransport({
  host: "ssl0.ovh.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "no-reply@hap.sh", // generated ethereal user
    pass: "Hapshot99", // generated ethereal password
  },
});
var rand,mailOptions,host,link;

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

router.get('/send', (req, res) =>{
  const token = req.cookies['HapSHOT']
  let email;
  if (!(token == null)){
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    var decoded = jwt.verify(token, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3");
    const myID = decoded['id'];
    db2.query('SELECT id,name,email,active FROM users WHERE id = ?',myID, async (error,results) =>{
      if (!results) {
        res.render('index',{
          message : 'WTF'
        })
      } else {
        console.log(results[0]);
        email = results[0].email;
        isActive = results[0].active;
        if (isActive == false) {
          link="http://"+req.get('host')+"/verify?id="+rand;
          mailOptions={
            to : email,
            subject : "Confirm your Email account - HAPSHOT",
            html : "Hello there,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
          }
          console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
              res.end("bad email error");
            }else{
              res.render('index',{
                message : 'Hello !'
              })
            }
          });
        }
      }
    })
  } else {
    res.render('index',{
      message : 'Hello !'
    })
  }
});

router.get('/verify', (req, res) =>{
  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
          console.log("email is verified");
          db2.query('SELECT id,name,email,active FROM users WHERE email = ?',mailOptions.to, async (error,results) =>{
            db2.query('UPDATE users SET active=true WHERE id=?', {id: results[0].id}, (error, results2) =>{
              if (error) {
                res.send("erreur BDD update active user");
              } else {
                res.redirect('/login');
              }
            });
          })
      }
      else
      {
          console.log("email is not verified");
          res.end("<h1>Bad Request</h1>");
      }
  }
  else
  {
      res.end("<h1>Request is from unknown source");
  }
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
        if (results[0].active == 1) {
          res.render('feed',{
            hapshooter : results[0].name
          })
        } else{
          res.redirect('/send')
        }
      }
    })
  } else {
    res.render('index',{
      message : 'Hello !'
    })
  }
});

module.exports = router;
