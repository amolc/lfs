angular.module('adminPanel').controller('donarController', [
    '$scope',
    '$http',
    '$stateParams',
    '$location',
    '$rootScope',
    '$state',
    '$timeout',
    'store',
    'ApiService',
    'modalService',
    function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store, ApiService, modalService) {

        $scope.init = function() {
           $scope.adminsession = store.get('adminsession') || {};
        };
        $scope.adminsession = store.get('adminsession') || {};


        $scope.currentPage = 1;
        $scope.pageSize = 40;

        $scope.getdonarroll = function(){
           $http.get(baseUrl + 'donar/getdonarsroll').success(function(res, req){
                $scope.donarrolls = res;
           }).error(function(error) {
                console.log("Error", error);
           });
        }
        $scope.getdonarroll();

        
        $scope.donar = {
          donorid : 0,
          donorname : '',
          id : $scope.adminsession.id ,
          donortype : '',
          roleid : ''
        }
        

        $scope.addupdatedonar = function(AddDonarForm){
            if(AddDonarForm.$valid){
                if($scope.donar.donorid > 0){
                    $scope.updatedonar();
                } else if($scope.donar.donorid === 0){
                    $scope.adddonar();
                }
                
            }
            
        }

        $scope.editDonar =function (data){
            //$scope.donar =data;
            $scope.donar = JSON.parse(JSON.stringify(data));
            $scope.ShowHide();
        }

        $scope.adddonar  = function(){
                $scope.donar.id = $scope.adminsession.id;
                $http.post(baseUrl + 'donar/adddonar' , $scope.donar).success(function(res, req){
                    if(res.status == true){
                        $scope.donarlist.push({
                            "donorid":res.record.insertId,
                            "donorname":$scope.donar.donorname,
                            "donortype":$scope.donar.donortype,
                            "nominationcode":$scope.donar.nominationcode,
                            "preftitle":$scope.donar.preftitle,
                            "roleid":$scope.donar.roleid
                        });
                        //console.log("donarlist:",$scope.donarlist);
                        $scope.AddDonarForm.$setPristine();
                        $scope.resetform();
                        $scope.getdonarlist();
                    }
                    
                }).error(function(error) {
                    console.log("Error", error);
                }); 
        };

        $scope.updatedonar = function(){
             $http.post(baseUrl + 'donar/updatedonar' , $scope.donar).success(function(res, req){
                    if(res.status == true){
                        $scope.getdonarlist();
                        $scope.AddDonarForm.$setPristine();
                        $scope.resetform();
                        //$scope.ShowHide();
                    }
                    
                }).error(function(error) {
                    console.log("Error", error);
            }); 
        }
        


        $scope.getdonarlist = function(){
            var id = $scope.adminsession.id
           $http.get(baseUrl + 'donar/getdonarlist/' + id).success(function(res, req){
                $scope.donarlist = res;
                var filtercategory = _.where(res,{'donortype':$scope.donortype});
           }).error(function(error) {
                console.log("Error", error);
           });
        };


        $scope.getallFilterdonarlist = function(){
               $http.get(baseUrl + 'donar/getallFilterdonarlist').success(function(res, req){
                    $scope.AllList = res;
               }).error(function(error) {
                    console.log("Error", error);
               });
        };
        $scope.getallFilterdonarlist();


        $scope.clear = function(){
            $state.reload();
        }
          
        if($scope.adminsession.login == true){
            $scope.getdonarlist();    
        }
        
        //function for hide show form
        $scope.ShowHide = function() {
            $scope.IsVisible = $scope.IsVisible ? false : true;
        };

        $scope.resetform = function(){
                $scope.donar = {
                    donorid : 0,
                    donorname : '',
                    id : $scope.adminsession.id ,
                    donortype : '',
                    roleid : 0
                }
                $scope.ShowHide();
        }


        $scope.askdelete = function(currentdonar){
            $scope.currentdonar = currentdonar;
        }

        $scope.deletedonor = function(){
            $http.post(baseUrl + 'donar/deletedonor' , $scope.currentdonar).success(function(res, req){
                    if(res.status == true){
                         $scope.getdonarlist();
                    }
                    
                }).error(function(error) {
                    console.log("Error", error);
            });
        };

        $scope.searchbyoption = function(searchForm,searchobj){
            if(searchForm.$valid){
                searchobj.id = $scope.adminsession.id;
                $http.post(baseUrl + 'donar/searchdonor' , searchobj).success(function(res, req){
                        $scope.donarlist = res;
                    }).error(function(error) {
                        console.log("Error", error);
                });
            }
        }

        $scope.uploadDonarCsv = function() {
        if ($scope.csvFile === undefined) {
            // $scope.AsmselectFilemsg = 'Please Select CSV File';
            // $scope.showAsmselectFilemsg = true;
            // $timeout(function() {
            //     $timeout(function() {
            //         $scope.showAsmselectFilemsg = false;
            //     }, 3000);
            // }, 2000);

        } else {

            if ($scope.csvFile) {
                Papa.parse($scope.csvFile, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {

                        if (results.data.length > 0) {
                            $scope.csvData = {
                                id: $scope.adminsession.id,
                                csvData: results.data
                            };
                            $http.post(baseUrl + 'donar/donorImport', $scope.csvData).success(function(res) {
                                //console.log(res);
                                if (res.status === false) {
                                    $scope.showimporterrormsg = true;
                                    $scope.importerrormsg = 'Records not imported';
                                    $timeout(function() {
                                        $scope.importerrormsg = false;
                                    }, 3000);

                                } else {
                                    $scope.showimportmessageCsv = true;
                                    $scope.showimportmsg = " Records successfully imported"; 
                                    $timeout(function() {
                                        $scope.showimportmessageCsv = false;
                                        $state.go('mainview.donar');
                                    }, 3000);
                                }
                                $scope.getdonarlist();
                                $scope.csvData = {};
                                $scope.csvFile = '';
                            }).error(function() {
                                $scope.newsData = {};
                            });
                        } else {
                            console.log("file select valid file");
                        }
                    }
                });
            } else {
                $scope.PhysicianSelectFileMsg = 'Please Select CSV File';
                $scope.showPhysicianSelectFileMsg = true;
            }
        }
    };

    $scope.donorImport = function(ele) {
        $scope.csvFile = ele.files[0];
        $scope.$apply();
    };

    $scope.csv = {
        contact_name: '',
        email: '',
        id: $scope.adminsession.id
    };

    $scope.clearcsv = function functionName() {
        $scope.csvFile = {};

    };
    
    }
]);
