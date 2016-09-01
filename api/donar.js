var express = require('express');
var router = express.Router();
var http = require('http');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var md5 = require('md5');
var env = require('./environment');
var connection = env.Dbconnection;
var Donar_Role = CRUD(connection, 'donor_roles');
var donar = CRUD(connection, 'donors');
var async = require('async');

router.get('/getdonarsroll', function(req, res) {
    Donar_Role.load({}, function(err, val) {
        res.jsonp(val);
    });
});

/*router.post('/adddonar', function(req, res) {
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

});*/

router.post('/adddonar', function(req, res) {
    var nominationcode = getRandomSpan();

    donar.load({ 'nominationcode': nominationcode }, function(error1, result1) {
        if (error1) {
            console.log("Error");
        } else {
            //console.log("result1:",result1);
            if (result1 == null || result1 == '') {
                //console.log("yeepie number not available in DB ");
                donar.create({
                    'donorname': req.body.donorname,
                    'preftitle': req.body.preftitle,
                    'nominationcode': nominationcode,
                    'roleid': req.body.roleid,
                    'donortype': req.body.donortype,
                    'admin_id': req.body.id,
                    'created_on': env.timestamp(),
                    'modified_on': env.timestamp()
                }, function(error, result) {
                    if (result) {
                        responsedata = {
                            status: true,
                            record: result,
                            message: 'Donar Added Successfully'
                        }
                        res.jsonp(responsedata);
                    } else {
                        responsedata = {
                            status: false,
                            record: result,
                            message: 'Donar Failed to Add'
                        }
                        res.jsonp(responsedata);
                    }
                })
            } else {
                console.log("Number Available in DB");
                responsedata = {
                    status: false,
                    record: error1,
                    message: 'Nomination code already exists in DB'
                }
                res.jsonp(responsedata);
            }

        }
    });

    function getRandomSpan() {
        return Math.floor((Math.random() * 99999999999) + 1);
    }

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
    donar.update({ 'donorid': req.body.donorid }, {
        'donorname': req.body.donorname,
        'preftitle': req.body.preftitle,
        'nominationcode': req.body.nominationcode,
        'roleid': req.body.roleid,
        'donortype': req.body.donortype,
        'modified_on': env.timestamp()
    }, function(error, result) {
        if (result) {
            responsedata = {
                status: true,
                record: result,
                message: 'Donar updated Successfully'
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
    donar.destroy({ 'donorid': req.body.donorid }, function(error, result) {
        if (result) {
            responsedata = {
                status: true,
                record: result,
                message: 'Donar deleted Successfully'
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
    var admin_id = req.body.id;
    var donorname = req.body.name;
    var donortype = req.body.type;
    var nominationcode = req.body.nomination;

    if (req.body.type) {
        //var sql = "SELECT * from donors where donortype LIKE '%" + donortype + "%'" + "AND admin_id = " + admin_id;
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.donortype LIKE '%" + donortype + "%'" + "AND admin_id = " + admin_id;
    } else if (req.body.name) {
        //var sql = "SELECT * from donors where donorname LIKE '%" + donorname + "%'" + "AND admin_id = " + admin_id;
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.donorname LIKE '%" + donorname + "%'" + "AND admin_id = " + admin_id;
        //console.log("sql query:",sql);
    } else if (req.body.nomination) {
        //var sql = "SELECT * from donors where nominationcode LIKE '%" + nominationcode + "%'" + "AND admin_id = " + admin_id;
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.nominationcode LIKE '%" + nominationcode + "%'" + "AND admin_id = " + admin_id;
    } else {
        //var sql = "SELECT * from donors";
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid"
    }

    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.post('/donorImport', function(req, res) {
    var csvData = req.body.csvData;
    var i = 0;
    var status = '';


    async.forEach(csvData, function(data, callback) {
        var nominationcode = getRandomSpan();
        if (data.donorname === undefined && data.donar_type_id === undefined && data.donar_category === undefined) {
            status = false;
            callback();
        } else {
            donar.load({ 'nominationcode': nominationcode }, function(error1, result1) {
                if (error1) {
                    console.log("Error");
                } else {
                    if (result1 == null || result1 == '') {

                        var con_preftitle = mysql.escape(data.preftitle);
                        var con_donorname = mysql.escape(data.donorname);

                        var query = "INSERT INTO donors (donorname,donortype,nominationcode,preftitle,roleid,admin_id,created_on,modified_on) VALUES (" + con_donorname + ",'" + data.donar_category + "'," + nominationcode + "," + con_preftitle + ",'" + data.donar_type_id + "','" + req.body.id + "'," + env.timestamp() + "," + env.timestamp() + ")";

                        connection.query(query, function(err, dataL) {
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
                    } else {
                        console.log("Number Available in DB");
                        responsedata = {
                            status: false,
                            record: error1,
                            message: 'Nomination code already exists in DB'
                        }
                        res.jsonp(responsedata);
                    }
                }
            });

        }

        function getRandomSpan() {
            return Math.floor((Math.random() * 99999999999) + 1);
        }

    }, function(error) {
        console.log('error async', error);
        if (!error) {
            //console.log("status:", status);
            res.jsonp({ "status": status, count: i });
        }
    });

});

router.get('/getallFilterdonarlist', function(req, res) {
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
    var sql = "SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.roleid,donor_roles.role_name,donor_roles.imageurl FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid WHERE donortype = 'Corporate Donors' ORDER BY donorid DESC";
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.get('/donarlistbyIndividual', function(req, res) {
    var sql = "SELECT donors.donorid,donors.donorname,donors.preftitle,donors.nominationcode,donors.donortype,donor_roles.roleid,donor_roles.role_name,donor_roles.imageurl FROM donors INNER JOIN donor_roles ON donors.roleid=donor_roles.roleid WHERE donortype = 'Individual Donors' ORDER BY donorid DESC";
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            res.jsonp(response);
        }
    });
});

router.post('/searchallinone', function(req, res) {

    //var value = req.body.value;
    // var typeofsearch = req.body.typeofsearch;
    var title = req.body.title;
    var type = req.body.type;


    if (title == '' || title == 'undefined ') {
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.donortype LIKE '%" + type + "%' ORDER BY t1.donorid DESC";
    } else {
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.preftitle LIKE '%" + title + "%'" + " AND t1.donortype LIKE '%" + type + "%'";
    }

    //console.log("sql query:", sql);
    /*if (typeofsearch === 'name') {
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.donorname LIKE '%"  + value + "%'" + " AND t1.donortype LIKE '%" + type + "%'";
    } else if (typeofsearch === 'title') {
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.preftitle LIKE '%"  + value + "%'" + " AND t1.donortype LIKE '%" + type + "%'";
    } else {
        var sql = "SELECT t1.*, t2.* FROM donors t1, donor_roles t2 WHERE t1.roleid = t2.roleid && t1.nominationcode LIKE '%"  + value + "%'" + " AND t1.donortype LIKE '%" + type + "%'";
    }*/
    connection.query(sql, function(error, response) {
        if (error) {
            console.log(error);
        } else {

            if (response == '' || response == null) {
                responsedata = {
                    status: false,
                    typeof: type,
                    record: response
                }
            } else {
                responsedata = {
                    status: true,
                    typeof: type,
                    record: response
                }
            }

            res.jsonp(responsedata);
        }
    });
});

module.exports = router;
