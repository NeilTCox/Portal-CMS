var express = require('express');
var router = express.Router();

var pagesModel = require('../models/pages');

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
      console.log(pages.length);
      console.log(pages);
      res.render('admindash', {
        pageList: pages
      });
    }else {
      next(err);
    }
  })
});

router.get('/addpage', requireLogin, function(req, res, next) {
  res.render('editpage');
});

router.get('/settings', requireLogin, function(req, res, next) {
  res.render('settings');
});

router.get('/logout', function(req, res, next){
  req.session.reset();
  res.redirect('/auth')
})

module.exports = router;
