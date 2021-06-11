var db = require('../db/db.js');

module.exports = {
  getProfileFromUsername : function (username,callback){
    db.query('SELECT id, name, email FROM users WHERE name=?',username, async (error,results) =>{
      console.log(results[0]);
      if (typeof results[0] == 'undefined') {
        console.log("noooooope"),
        callback({
          id: 0,
          name : 'User does not exists',
          email : ''
        })
      }else{
        callback ({
          id: results[0].id,
          name : results[0].name,
          email : results[0].email
        })
      }
    })
  }
};
