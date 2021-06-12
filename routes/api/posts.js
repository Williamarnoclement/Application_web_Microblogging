const express = require('express');
const router = express.Router();

var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require("jsonwebtoken");


const mysql = require('mysql');
var db = require('../../db/db.js');

router.get('/', (req,res) => {
  console.log("accès lecture générique");
  /***ici on recupere la liste des posts*/
  try{
    // var sql = "SELECT users.name AS user, products.name AS favorite FROM users JOIN products ON users.favorite_product = products.id";
    db.query('SELECT msg.date AS date, msg.text AS text, users.name AS name FROM msg JOIN users ON msg.user=users.id ORDER BY date DESC', async (error,results) =>{
      if (!results) {
        //on renvoie un json vide
        console.log("query error");
        res.sendStatus(400);
      } else {
        //on renvoie les resultats
        var reformated_res = [];
        console.log(results);
        for(var i in results) {
          var item = results[i];
          /// GET NAME FROM ID ----------------
          var obj = {
            'postedBy': item.name,
            'date': item.date,
            'content': item.text,
            'profilePic': "go"
          }
          reformated_res.push(obj);
        }
        res.status(200).send(reformated_res);
      }
    });
  } catch {
    console.log(error);
  }
});


router.get('/:username', (req, res, next) => {
  /***ici on recupere la liste des posts*/
  console.log("accès lecture username");
    var tools = require('../../controllers/tools');
    tools.getProfileFromUsername(req.params.username, function(result2) {
      if (result2.id != 0) {
        db.query('SELECT msg.date AS date, msg.text AS text, users.name AS name FROM msg JOIN users ON msg.user=users.id WHERE users.id=? ORDER BY date DESC;', result2.id, async (error,results) =>{
          if (results.id == 0) {
            //on renvoie un json vide
            console.log("query error");
            res.sendStatus(400);
          } else {
            var reformated_res = [];
            console.log(results);
            for(var i in results) {
              var item = results[i];
              /// GET NAME FROM ID ----------------
              var obj = {
                'postedBy': item.name,
                'date': item.date,
                'content': item.text,
                'profilePic': "go"
              }
              reformated_res.push(obj);
            }
            res.status(200).send(reformated_res);
          }
        });
      }else{
        res.send('user does not exists');
      }
    })
});

router.post("/", async (req, res, next) => {
  console.log("insertion demandée");

  const token = req.cookies['HapSHOT']
  if (!(token == null)){
    var decoded = jwt.verify(token, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3");
    const myID = decoded['id'];
    const msg = req.body.msg;
    db.query('INSERT INTO msg SET ?', {user: myID, text: msg}, (error, results) =>{
      if (error) {
        res.send("erreur BDD insertion msg");
      } else {
        console.log("insertion réussie");
        res.redirect('/home');
      }
    });
  }
});

module.exports = router;
