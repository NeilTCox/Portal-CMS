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
  res.render('addpage');
});

router.post('/addpage', function(req, res){
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

router.get('/settings', requireLogin, function(req, res) {
  res.render('settings');
});



router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/auth');
})

router.get('/editpage/:_id', function(req, res) {
  pagesModel.findOne({_id: req.params._id}, function(err, page) {
    if (err) {
      console.error(err);
    }
    if (page) {
      var visible_check = '';
      if (page.visible) {
        visible_check = 'checked';
      }
      var blue_selected = '';
      var green_selected = '';
      var red_selected = '';
      if (page.template === 'Blue') {
        blue_selected = 'selected';
      } else if (page.template === 'Green') {
        green_selected = 'selected';
      } else {
        red_selected = 'selected';
      }
      res.render('editpage', {
        title: page.title,
        main_content: page.content,
        url: page.url,
        blue_selected: blue_selected,
        green_selected: green_selected,
        red_selected: red_selected,
        visible: visible_check,
        _id: page._id
      })
    }
  });
});

router.post('/editpage/:_id', function(req, res) {
  pagesModel.findOneAndUpdate({_id: req.params._id},
  {$set:
    {
      title: req.body.title,
      content: req.body.main_content,
      url: req.body.url,
      template: req.body.template,
      visible: req.body.visible
  }}, function(err) {
        if (err) {
          // for if duplicate URL
          // show h1 error if url already taken (render), same as wrong password
        }
        res.redirect('/admin');
  });
})

router.post('/visiblepage/:_id', function(req, res){
  console.log(req.params._id)
  pagesModel.findOne({_id: req.params._id}, function(err, page){
    if (page.visible === true) {
      pagesModel.findOneAndUpdate({_id: req.params._id},
        {$set: {'visible': false}}, function(err, page) {
          if (err) {
            console.error(err);
          }
        });
    }else {
      pagesModel.findOneAndUpdate({_id: req.params._id},
        {$set: {'visible': true}}, function(err, page) {
          if (err) {
            console.error(err);
          }
        });
    }
  });
  res.redirect('/admin');
});

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
});

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
