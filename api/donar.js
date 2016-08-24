var express = require('express');
var router = express.Router();
var http = require('http');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var md5=require('md5');
var env = require('./environment');
var connection = env.Dbconnection;
var Donar_Role = CRUD(connection,'donor_roles');
var donar = CRUD(connection,'donors');

router.get('/getdonarsroll', function(req, res) {
  Donar_Role.load({}, function (err, val) {
       res.jsonp(val);
  });
});

router.post('/adddonar', function(req, res) {
donar.create({
  'donorname' : req.body.donorname ,
  'preftitle' : req.body.preftitle,
  'nominationcode': req.body.nominationcode,
  'roleid' : req.body.roleid,
  'donortype' : req.body.donortype,
  'admin_id' : req.body.id,
  'created_on': env.timestamp(),
  'modified_on': env.timestamp()
},function(error,result){
     if (result) {
      responsedata = {
        status: true,
        record: result,
        message:'Donar Added Successfully'
    }
    res.jsonp(responsedata);
  } else {
    responsedata = {
      status: false,
      record: result,
      message: 'Donar Failed to Add'
    }
    //console.log(error);
    res.jsonp(responsedata);
  }
})
});

router.get('/getdonarlist/:id', function(req, res) {
  //console.log("params:",req.params.id);
  donar.load({'admin_id': req.params.id}, function (err, val) {
  		//console.log("err:",err);
  		//console.log("val:",val);
       res.jsonp(val);
  });
});

router.post('/updatedonar', function(req, res) {
	//console.log("req.body:",req.body);
	donar.update({'donorid' :req.body.donorid},{
	  'donorname' : req.body.donorname ,
	  'preftitle' : req.body.preftitle,
	  'nominationcode': req.body.nominationcode,
	  'roleid' : req.body.roleid,
	  'donortype' : req.body.donortype,
	  'modified_on': env.timestamp()
	},function(error,result){
	     if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message:'Donar updated Successfully'
	    }
	    res.jsonp(responsedata);
	  } else {
	    responsedata = {
	      status: false,
	      record: result,
	      message: 'Donar Failed to updated'
	    }
	    //console.log(error);
	    res.jsonp(responsedata);
	  }
	})
});

router.post('/deletedonor', function(req, res) {
  donar.destroy({'donorid' :req.body.donorid},function(error,result){
       if (result) {
        responsedata = {
          status: true,
          record: result,
          message:'Donar deleted Successfully'
      }
      res.jsonp(responsedata);
    } else {
      responsedata = {
        status: false,
        record: result,
        message: 'Donar Failed to delete'
      }
      //console.log(error);
      res.jsonp(responsedata);
    }
  })
});

module.exports = router;
