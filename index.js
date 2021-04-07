const express = require('express');
const app = express();
const port = 8000;

const server = app.listen(port, () => console.log("Server listening on port " + port));

/***************DATABASE***************/
const mysql = require('mysql');


/***************VIEWS***************/
//set view engine HBS
app.set('view engine', 'hbs');
//set 'views' folder as views
app.set('views', 'views');
//define public Directory as accessible by everyone by making it static
const publicDirectory = path.join(__dirname, './public');
ego.use(express.static(publicDirectory));

app.get("/", (req, res, next) => {
	res.render("index");
})
