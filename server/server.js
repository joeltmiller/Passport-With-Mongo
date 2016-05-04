//NPM
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var localStrategy = require('passport-local').Strategy;

//Local
// var encryptLib = require('../modules/encryption');
var index = require('./routes/index');
// var connectionString = 'postgres://localhost:5432/passport_stuff';
var User = require('../models/user');

var app = express();

//MongoDB
var mongoURI = "mongodb://localhost/Passport_Mongo2";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
  console.log('There was an error connecting to MongoDB', err);
})

MongoDB.once('open', function(){
  console.log('Connected to MongoDB');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('server/public'));

app.use(session({
  secret:'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}))

app.use(passport.initialize());
app.use(passport.session());

//Passport

passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
 },
  function(request, username, password, done){
    console.log('CHECKING PASSWORD');

    User.findOne({username: username}, function(err, user){
      if(err){
        console.log(err);
      }

      if(!user){
        return done(null, false, {message: 'Incorrect username or password'});
      }

      user.comparePassword(password, function(err, isMatch){
        if(err){
          console.log(err);
        }

        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {message: 'Incorrect username or password'})
        }

      })

    })

  }
));

passport.serializeUser(function(user, done){
  console.log('Hit serializeUser');
  done(null, user.id); //Trail of breadcrumbs back to user
});

passport.deserializeUser(function(id, done){
  console.log('Hit deserializeUser');

  User.findById(id, function(err, user){
    if(err){
      done(err);
    } else {
      done(null, user);
    }
  })

})

//Routes
app.use('/', index);

var server = app.listen(process.env.PORT || 3000, function(){
  var portGrabbedFromLiveServer = server.address().port;

  console.log('Listening on port', portGrabbedFromLiveServer);
})
