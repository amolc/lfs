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
var async = require('async');

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

  /*donar.load({'admin_id': req.params.id}, function (err, val) {
       res.jsonp(val);
  });*/
  var sql = "SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donors.roleid ,donor_roles.role_name FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid where donors.admin_id = " + req.params.id + " ORDER by donors.donorid DESC";
    //console.log("sql:",sql);
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
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

router.get('/getalldonarlist', function(req, res) {
  //console.log("getalldonarlist");
  var sql = 'SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.roleid,donor_roles.role_name,donor_roles.imageurl FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid';
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.post('/searchdonor', function(req, res) {
  //console.log("searchdonor");
  //console.log("res 121:",req.body);
  var admin_id  = req.body.id;
  var donorname = req.body.name;
  var donortype = req.body.type;
  var nominationcode = req.body.nomination;

  if(req.body.type){
    //console.log("search by type");
    var sql = "SELECT * from donors where donortype LIKE '%" + donortype + "%'" + "AND admin_id = " + admin_id;  
  }else if(req.body.name){
    //console.log("search by name");
    var sql = "SELECT * from donors where donorname LIKE '%" + donorname +"%'" + "AND admin_id = " + admin_id; 
  }else if(req.body.nomination){
    var sql = "SELECT * from donors where nominationcode LIKE '%" + nominationcode +"%'" + "AND admin_id = " + admin_id;  
    //console.log("search by nominationcode");
  }else{
    //console.log("search all");
    var sql = "SELECT * from donors";  
  }
    //console.log("sql query:",sql);
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.post('/donorImport', function(req, res) {
    //console.log("req body:",req.body);
    var csvData = req.body.csvData;
    var i=0;
    //console.log('req', csvData);
    var status = '';
    async.forEach(csvData, function(data, callback) {
     // console.log("data:",data);
        if (data.donorname === undefined && data.roleid === undefined && data.donortype === undefined) {
            status = false;
            callback();
        } else {
            var query = "INSERT INTO donors (donorname,donortype,nominationcode,preftitle,roleid,admin_id,created_on,modified_on) VALUES ('" + data.donorname + "','" + data.donortype + "'," + data.nominationcode + ",'" + data.preftitle + "','" + data.roleid + "','" + req.body.id + "'," + env.timestamp() + "," + env.timestamp() + ")";
           // console.log("query:",query);
            connection.query(query, function(err, dataL) {
              //console.log('dataL',dataL);
                if (!err) {
                      status = true;
                      i = ++i;
                     callback();
                } else {
                    console.log('error while importing csv', err);
                    status = false;
                     callback();
                }
            });
        }       
    }, function(error) {
      console.log('error async',error);
        if (!error) {
            console.log("status:",status);
            res.jsonp({"status":status,count:i});
        }
    });
});

router.get('/getallFilterdonarlist', function(req, res) {
  //console.log("getalldonarlist");
  var sql = 'SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.role_name FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid';
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});


router.get('/donarlistbycorporate', function(req, res) {
  //console.log("getalldonarlist");
  var sql = "SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.roleid,donor_roles.role_name,donor_roles.imageurl FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid WHERE donortype = " + "'Corporate Donors'" ;
    //console.log("query:",sql);
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.get('/donarlistbyIndividual', function(req, res) {
  //console.log("getalldonarlist");
  var sql = "SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.roleid,donor_roles.role_name,donor_roles.imageurl FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid WHERE donortype = " + "'Individual Donors'" ;
    //console.log("query:",sql);
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});


module.exports = router;
