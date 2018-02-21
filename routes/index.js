var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var usersModel = require('../models/users');
var pagesModel = require('../models/pages');

router.get('/', function(req, res, next) {
  pagesModel.find(function(err, pages) {
    if (err) {
      return res.send(err);
    } else if (pages) {
      res.render('home', {
        pageList: pages
      });
    } else {
      next(err);
    }
  });
});

router.get('/auth', function(req, res, next) {
  res.render('adminauth');
});

router.post('/auth/register', function(req, res) {
  var newUser = new usersModel({
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save(function(err, user) {
    if (err) {
      res.render('adminauth', {
        authError: 'User Already Exists'
      });
      return console.error(err);
    }
    res.redirect('/admin');
  });
});

router.post('/auth/login', function(req, res) {
  usersModel.findOne({
    'email': req.body.email
  }, function(err, user) {
    if (err) {
      console.error(err);
      console.log('THERE HAS BEEN AN ERROR. USER NOT IN DB?');
      res.redirect('/auth');
    } else if (user) {
      if (user.password == req.body.password) {
        req.session.user = user;
        res.redirect('/admin');
      } else {
        res.render('adminauth', {
          authError: 'Incorrect Password'
        });
      }
    } else {
      res.render('adminauth', {
        authError: 'User Does Not Exist'
      });
    }
  });

});

router.get('/:page', function(req, res, next) {
  pagesModel.findOne({
    url: req.params.page.trim()
  }, function(err, page) {
    if (err) {
      return res.send(err);
    }
    if (page && page.visible) {
      res.render('template', {
        title: page.title,
        main_content: page.content,
        _id: page._id,
        url: page.url
      });
    } else {
      next(err);
    }
  });
});

module.exports = router;