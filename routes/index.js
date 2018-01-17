var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String
});
var userModel = mongoose.model('users', userSchema);

router.get('/test', function(req, res, next) {
  var newUser = new userModel({
    email: 'neiltcox@icloud.com',
    password: "asdf",
    extratest: "lololol",
  })
  newUser.save(function(err, user){
    if (err) return console.error(err);
    console.log(user);
  });
  res.end()
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', { title: 'Express' });
});

module.exports = router;
