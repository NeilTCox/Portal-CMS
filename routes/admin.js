var express = require('express');
var router = express.Router();

var pagesModel = require('../models/pages');
var usersModel = require('../models/users')

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/auth');
  } else {
    next();
  }
};

router.get('/auth', function(req, res, next) {
  res.render('adminauth');
});

router.get('/', requireLogin, function(req, res, next) {
  pagesModel.find({owner_id: req.user._id}, function(err, pages){
    if (err) {
      return res.send(err);
    } else if (pages) {
      res.render('admindash', {
        pageList: pages
      });
    }else {
      next(err);
    }
  })
});

router.get('/addpage', requireLogin, function(req, res) {
  res.render('editpage');
});

router.get('/settings', requireLogin, function(req, res) {
  res.render('settings');
});

router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/auth');
})

router.post('/deletepage/:_id', function(req, res){
  console.log(req.params._id);
  pagesModel.remove({_id: req.params._id}, function(err){
    if (err) {
      console.error(err);
    }else {
      console.log('REMOVED!!!!');
    }
  });
  res.redirect('/admin');
})

router.post('/settings/set', function(req, res){
  usersModel.findOneAndUpdate({'email': req.user.email},
    {$set: {'password': req.body.password, 'email': req.body.email}}, function(err, user){
      if (err) {
        console.error(err);
      }
    });
    res.redirect('/admin');
})

module.exports = router;
