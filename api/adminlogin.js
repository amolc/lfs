var express = require('express');
var router = express.Router();
var http = require('http');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var md5=require('md5');
var env = require('./environment');
var connection = env.Dbconnection;
var AdminCRUD = CRUD(connection,'admin_user');

/*var superAdminCRUD = CRUD(connection,'superadmin');
var transporter = env.transporter;*/
//console.log("connection:",connection);

router.post('/adminlogin', function(req, res) {
  console.log("adminlogin");
 //console.log("req.body:",req.body);
  var email = req.body.email;
  //var username = req.body.username;
  var password=md5(req.body.password);
  AdminCRUD.load({
    email : email,
    password : password
  }, function (err, val) {
    console.log('Error in Login',err);
  var resdata={
      record:'',
      status:false,
      message :'err'
    };
        if(val.length>0){
          resdata.record=val;
          resdata.status=true;
          resdata.message='successfully login welcome ';
          res.jsonp(resdata);

        }else{
        resdata.status = false;
        resdata.message = 'Wrong Username or Password';
        res.jsonp(resdata);
      }
  });
});

module.exports = router;