var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
  console.log('Running pre save user function');
  var user = this;
  //If password has not changed, do not proceed
  if(!user.isModified('password')){
    return next();
  };
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err){
      return next(err);
    };
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err){
        return next(err);
      }
      //Replace clear text password with hashed password
      user.password = hash;
      next();
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, done){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return done(err);
    } else {
      done(null, isMatch);
    }
  })
}




module.exports = mongoose.model('users', UserSchema);
