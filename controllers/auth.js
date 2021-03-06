const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var db = require('../db/db.js');

exports.login = async(req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).render('login',{
        message : 'Missing eMail or password'
      })
		}
		db.query('SELECT * FROM users WHERE email = ?',[email], async (error,results) =>{
			if (!results) {
				res.status(401).render('login',{
	        message : 'User does not exist'
	      })
			} else if(!(await bcrypt.compare(password, results[0].password))){
				res.status(401).render('login',{
					message : 'Bad password'
				})
			} else {

				const id = results[0].id;
				const token = jwt.sign({id : id}, /**process.env.JWT_SECRET**/"sup3rm0tdep4ss3", {
					expiresIn: /**process.env.JWT_EXPIRES_IN**/"30d"
				});

				const cookieOptions = {
					expires: new Date(
						Date.now() + /**process.env.JWT_COOKIE_EXPIRES**/30 * 24 * 60 * 60 * 1000
					),
					httpOnly: true
				}

				res.cookie('HapSHOT', token, cookieOptions);
				res.redirect('/home')
			}
		});

  } catch (error) {
    res.send("erreur BDD 3");
  }
}

exports.register = (req,res) => {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  db.query('SELECT email FROM users WHERE email = ?',[email], async (error, results) =>{
    if (error) {
      res.send("erreur BDD 1");
    }
    if (results.length > 0) {
      return res.render('register',{
        message : 'eMail already used..'
      })
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) =>{
      if (error) {
        res.send("erreur BDD insertion user");
      } else {
        res.redirect('/send');
      }
    });
  });
}
