const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
//authenticate input against database object
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email: email})
    .exec(function(error, user) {
      if (error){
        return callback(error);
      } else if (!user) {
        const err = new Error('User not found');
        res.render('login', {title: 'Login Error', msg: err});
      }

      bcrypt.compare(password, user.password, function(error, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}
//hash password by using pre method on Schema
UserSchema.pre('save', function(next) {
  const user = this
  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err) {
      return next(err);

    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
