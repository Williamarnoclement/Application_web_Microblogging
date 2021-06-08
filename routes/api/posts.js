const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
var db = require('../../db/db.js');

const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  /**
  Post.find()
  .then(results => res.status(200).send(results))
  .catch(error => {
  console.log(error);
  res.sendStatus(400);
})
**/
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
      //res.status(200).send(results);

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
})

router.post("/", async (req, res, next) => {

  //if (!req.body.msg) {
    console.log("new msg : "+ req.body.msg);
    //return res.sendStatus(400);
  //}
  /**var postData = {
    content: req.body.content
  }**/
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
})

module.exports = router;
