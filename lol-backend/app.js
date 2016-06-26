var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan     = require("morgan");
var jwt        = require("jsonwebtoken");
var expressJwt = require('express-jwt');
var userModel = require("./models/usermodel").userList;
var loginController = require('./controller/login');
var encoding = require("encoding");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//Access-Control-Allow-Origin 允许所有的域名。
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  }
});

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.post('/login',loginController.login);

var secret = 'this is the secret secret secret 12356';

app.use('/api',expressJwt({secret: secret}));
app.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  }
});

app.post('/authenticate',function(req,res) {
  if(req.body.username){
    userModel.findOne({username: req.body.username},function(err,doc){
      if (!(req.body.username === doc.username && req.body.password === doc.password)) {
        res.status(401).send('Wrong user or password');
        return;
      }
      if(!err && doc && req.body.password == doc.password){
        var profile = {
          playername: doc.playername,
          servername: doc.servername,
        };
        var token = jwt.sign(profile, secret, { expiresIn: "5h" });
        res.json({ token: token });
      }else{
        res.send({"code":201, msg:"用户名或者密码错误"});
      }
    });
  }
});

app.get('/api/restricted', function (req, res) {
  console.log('user ' + req.user.email + ' is calling /api/restricted');
  res.json({
    name: 'foo'
  });
});

app.post('/signup', function(req,res){
  if(req.body.username&&req.body.password){
    userModel.findOne({username : req.body.username},function(err,doc){
      if (!err) {
        if(!doc){
          var newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            servername: req.body.servername,
            playername: req.body.playername
          });
          newUser.save(function(err){
            if(!err){
              res.json({
                code: 200,
                msg: "注册成功"
              })
            }
          });
        }else{
          res.json({
            code: 201,
            msg: "此用户已被占用"
          });
        }
      }
    });
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//监听本地3001端口
app.listen(3001, function () {
  console.log('app is listening at port 3001');
});

module.exports = app;
