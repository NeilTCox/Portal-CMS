var express = require('express');
var router = express.Router();

router.get('/auth', function(req, res, next) {
  res.render('adminauth', { title: 'Express' });
});

router.get('/', function(req, res, next) {
  res.render('admindash', { title: 'Express' });
});

router.get('/addpage', function(req, res, next) {
  res.render('editpage', { title: 'Express' });
});

router.get('/settings', function(req, res, next) {
  res.render('settings', { title: 'Express' });
});

module.exports = router;
