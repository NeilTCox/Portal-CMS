var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var pagesModel = require('../models/pages');
var usersModel = require('../models/users');

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/auth');
  } else {
    next();
  }
}

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return month + "/" + day + "/" + year + " at " + hour + ":" + min;

}

router.get('/', requireLogin, function(req, res, next) {
  pagesModel.find({
    owner_id: req.user._id
  }, function(err, pages) {
    if (err) {
      return res.send(err);
    } else if (pages) {
      res.render('admindash', {
        pageList: pages
      });
    } else {
      next(err);
    }
  });
});

// router.get('/addpage', requireLogin, function(req, res) {
//   res.render('addpage');
// });

router.post('/addpage', function(req, res) {
  var newPage = new pagesModel({
    title: req.body.title,
    content: req.body.main_content,
    url: req.body.url,
    template: req.body.template,
    owner_id: req.user._id,
    visible: req.body.visible,
    updated: getDateTime()
  });
  newPage.save(function(err, user) {
    if (err) {
      // DISPLAY URL TAKEN ERROR
      res.render('admindash');
    } else {
      res.send(newPage);
    }

  });
});

router.get('/settings', requireLogin, function(req, res) {
  res.render('settings');
});

router.post('/settings/set', function(req, res) {
  usersModel.findOneAndUpdate({
    'email': req.user.email
  }, {
    $set: {
      'password': req.body.password,
      'email': req.body.email
    }
  }, function(err, user) {
    if (err) {
      console.error(err);
    }
  });
  res.redirect('/admin');
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

router.get('/editpage/:_id', function(req, res) {
  pagesModel.findOne({
    _id: req.params._id
  }, function(err, page) {
    if (err) {
      return res.send(err);
    }
    if (page) {
      res.render('editpage', {
        title: page.title,
        main_content: page.content,
        _id: page._id
      });
    } else {
      next(err);
    }
  });
  // pagesModel.findOne({
  //   _id: req.params._id
  // }, function(err, page) {
  //   if (err) {
  //     console.error(err);
  //   }
  //   if (page) {
  //     var visible_check = '';
  //     if (page.visible) {
  //       visible_check = 'checked';
  //     }
  //     var blue_selected = '';
  //     var green_selected = '';
  //     var red_selected = '';
  //     if (page.template === 'Blue') {
  //       blue_selected = 'selected';
  //     } else if (page.template === 'Green') {
  //       green_selected = 'selected';
  //     } else {
  //       red_selected = 'selected';
  //     }
  //     res.render('editpage', {
  //       title: page.title,
  //       main_content: page.content,
  //       url: page.url,
  //       blue_selected: blue_selected,
  //       green_selected: green_selected,
  //       red_selected: red_selected,
  //       visible: visible_check,
  //       _id: page._id
  //     });
  //   }
  // });
});

router.post('/editpage/:_id', function(req, res) {
  pagesModel.findOneAndUpdate({
    _id: req.params._id
  }, {
    $set: {
      content: req.body.main_content,
      updated: getDateTime()
    }
  }, function(err) {
    if (err) {
      console.error(err);
    } else {
      res.end();
    }
  });
});

router.post('/visiblepage/:_id', function(req, res) {
  pagesModel.findOne({
    _id: req.params._id
  }, function(err, page) {
    if (page.visible === true) {
      pagesModel.findOneAndUpdate({
        _id: req.params._id
      }, {
        $set: {
          'visible': false
        }
      }, function(err, page) {
        if (err) {
          console.error(err);
        } else {
          res.send(false);
        }
      });
    } else {
      pagesModel.findOneAndUpdate({
        _id: req.params._id
      }, {
        $set: {
          'visible': true
        }
      }, function(err, page) {
        if (err) {
          console.error(err);
        } else {
          res.send(true);
        }
      });
    }
  });
});

router.delete('/page/:_id', function(req, res, next) {
  pagesModel.remove({
    _id: req.params._id
  }, function(err) {
    if (err) {
      return console.error(err);
    }
  });
  res.end();
});

module.exports = router;