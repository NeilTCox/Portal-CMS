var mongoose = require('mongoose');

function toLower(str) {
  return str.toLowerCase();
}

var schema = mongoose.Schema({
  email: {
    type: String,
    set: toLower,
    unique: true
  },
  password: String,
});

module.exports = mongoose.model('users', schema);