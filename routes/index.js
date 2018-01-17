var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

function toLower (str) {
    return str.toLowerCase();
}

var userSchema = mongoose.Schema({
  email: {type: String, set: toLower},
  password: String
});
var userModel = mongoose.model('users', userSchema);

var pageSchema = mongoose.Schema({
  title: String,
  content: String,
  url: String,
  template: String,
});
var pageModel = mongoose.model('pages', pageSchema);

router.post('/auth/register', function(req, res){
  var newUser = new userModel({
    email: req.body.email,
    password: req.body.password,
  })
  newUser.save(function(err, user){
    if (err) return console.error(err);
    res.redirect('/admin');
  });
});

router.post('/auth/login', function(req, res){
  var attemptUser = new userModel({
    email: req.body.email,
    password: req.body.password,
  })

});

router.post('/admin/addpage', function(req, res){
  var newUser = new userModel({
    email: req.body.email,
    password: req.body.password,
  })
  newUser.save(function(err, user){
    if (err) return console.error(err);
    res.redirect('/admin');
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', { title: 'Express' });
});

router.get('/auth', function(req, res, next) {
  res.render('adminauth', { title: 'Express' });
});

module.exports = router;
