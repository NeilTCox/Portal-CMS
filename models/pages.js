var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: String,
  content: String,
  url: String,
  template: String,
  owner_id: Object
});

module.exports = mongoose.model('pages', schema);
