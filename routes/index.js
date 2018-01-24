var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var usersModel = require('../models/users');
var pagesModel = require('../models/pages');



router.post('/auth/register', function(req, res){
  var newUser = new usersModel({
    email: req.body.email,
    password: req.body.password,
  })
  newUser.save(function(err, user){
    if(err){
      res.redirect('/auth');
      return console.error(err);
    }
    res.redirect('/admin');
  });
});

router.post('/auth/login', function(req, res){
  usersModel.findOne({ 'email': req.body.email }, function (err, user) {
    if (err) {
      console.error(err);
      console.log('THERE HAS BEEN AN ERROR. USER NOT IN DB?')
      res.redirect('/auth');
    }else if (user.password == req.body.password) {
      req.session.user = user;
      console.log('SUCCESS!');
      res.redirect('/admin');
    }else {
      console.log('PASSWORD INCORRECT');
      res.redirect('/auth');
      //res.render('/auth', {authError: 'Password incorrect!'})?
    }
  });

});

router.post('/admin/addpage', function(req, res){
  var newPage = new pagesModel({
    title: req.body.title,
    content: req.body.main_content,
    url: req.body.url,
    template: req.body.template,
    owner_id: req.user._id,
    visible: req.body.visible
  })
  newPage.save(function(err, user){
    if(err){
      res.redirect('/admin/addpage');
      return console.error(err);
    }
    res.redirect('/admin');
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template');
});

router.get('/auth', function(req, res, next) {
  res.render('adminauth');
});

router.get('/:page', function(req, res, next){
  pagesModel.findOne({url: req.params.page.trim()}, function(err, page){
    if(err){
      return res.send(err);
    }
    if (page) {
      res.render('template', {
        title: page.title,
        main_content: page.content
      });
    }else{
      next(err);
    }
  })
});

module.exports = router;
