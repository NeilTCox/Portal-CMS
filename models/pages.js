var mongoose = require('mongoose');

function toLower (str) {
    return str.toLowerCase();
}

var schema = mongoose.Schema({
  title: String,
  content: String,
  url: {type: String, set: toLower, unique: true},
  template: String,
  owner_id: Object,
  visible: Boolean
});

module.exports = mongoose.model('pages', schema);
