var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: String,
  content: String,
  url: String,
  template: String,
  owner_id: Object,
  visible: Boolean
});

module.exports = mongoose.model('pages', schema);
