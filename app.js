var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');
var auth = function (req, res, next) {
  var unauthorized = function (res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  var passwordMatches = bcrypt.compareSync(user.pass, process.env.PAIRUP_ENCRYPTED_PASSWORD);
  if (user.name === process.env.PAIRUP_USERNAME && passwordMatches) {
    return next();
  } else {
    return unauthorized(res);
  };
};

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json())

var assignments = {};

app.post("/state.json", auth, function(req, res) {
  assignments = req.body
  res.end("OK")
});

app.get("/state.json", auth, function(req, res) {
  res.end(JSON.stringify(assignments))
});

module.exports = {app: app, auth: auth};
