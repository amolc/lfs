var express = require('express');
var router = express.Router();
var http = require('http');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var md5 = require('md5');
var env = require('./environment');
var connection = env.Dbconnection;
var AdminCRUD = CRUD(connection, 'admin_user');

router.post('/adminlogin', function(req, res) {
    var username = req.body.username;
    var password = md5(req.body.password);
    AdminCRUD.load({
        username: username,
        password: password
    }, function(err, val) {
        if (err) {
            console.log('Error in Login', err);
        }
        var resdata = {
            record: '',
            status: false,
            message: 'err'
        };
        if (val.length > 0) {
            resdata.record = val;
            resdata.status = true;
            resdata.message = 'successfully login welcome ';
            res.jsonp(resdata);

        } else {
            resdata.status = false;
            resdata.message = 'Wrong Username or Password';
            res.jsonp(resdata);
        }
    });
});

module.exports = router;
