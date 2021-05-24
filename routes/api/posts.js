const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
var db = require('../../db/db.js');


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
  db.query('SELECT msg.date AS date, msg.text AS text, users.name AS name FROM msg JOIN users ON msg.user=users.id', async (error,results) =>{
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

  if (!req.body.content) {
    console.log("Content param not sent with request");
    return res.sendStatus(400);
  }

  var postData = {
    content: req.body.content,
    postedBy: req.session.user
  }

  Post.create(postData)
  .then(async newPost => {
    newPost = await User.populate(newPost, { path: "postedBy" })

    res.status(201).send(newPost);
  })
  .catch(error => {
    console.log(error);
    res.sendStatus(400);
  })
})

module.exports = router;
