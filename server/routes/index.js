var router = require('express').Router();
var path = require('path');
var passport = require('passport');
var User = require('../../models/user');
// var pg = require('pg');
// var encryptLib = require('../../modules/encryption');

// var connectionString = 'postgres://localhost:5432/passport_stuff';

router.get('/failure', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/', function(request, response){
  console.log('User', request.user);
  console.log('Is authenticated', request.isAuthenticated());
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}))

router.get('/register', function(request, response){
  response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.get('/success', function(request, response) {
  console.log(request.user);
  console.log('User is logged in:' , request.isAuthenticated());
  response.sendFile(path.join(__dirname, '../public/views/success.html'));
});

router.get('/logout', function(request, response){
  request.logout();
  response.redirect('/');
});

router.post('/register', function(request, response){
  console.log(request.body);

  User.create(request.body, function(err){
    if(err){
      console.log('AHHH ERROR', err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })



})


router.get('/user/:id', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/:name', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/*', function(request, response, next){
  if(request.isAuthenticated()){
    next();
  } else {
    response.send('404 not found');
  }
})

module.exports = router;
