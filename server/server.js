var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');


var config = require('./config');
var User = mongoose.model('User', new mongoose.Schema({
	twitterId: { type: String, index: true },
	email: { type: String, unique: true, lowercase: true },
	password: { type: String, select: false },
	username: String,
	fullName: String,
	picture: String,
	accessToken: String
}));
 
mongoose.connect(config.db);

var app = express();
 
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: { email: 'Incorrect email' } });
    }
 
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: { password: 'Incorrect password' } });
      }
 
      user = user.toObject();
      delete user.password;
 
      var token = createToken(user);
      res.send({ token: token, user: user });
    });
  });
});

app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }
 
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });
 
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
 
        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});

app.post('/auth/twitter', function(req, res) {
	// TODO
});
 
app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

