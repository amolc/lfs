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
          roleid : 0
        }
        

        $scope.addupdatedonar = function(AddDonarForm){
            console.log(AddDonarForm);
            if(AddDonarForm.$valid){
                if($scope.donar.donorid > 0){
                    $scope.updatedonar();
                } else if($scope.donar.donorid === 0){
                    $scope.adddonar();
                }
                
            }
            
        }

        $scope.editDonar =function (data){
            console.log("data:",data);
            //$scope.donar =data;
            $scope.donar = JSON.parse(JSON.stringify(data));
            $scope.ShowHide();
        }

        $scope.adddonar  = function(){
            console.log('saas');
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
                        console.log("donarlist:",$scope.donarlist);
                        $scope.AddDonarForm.$setPristine();
                        $scope.resetform();
                        //$scope.getdonarlist();
                       // document.getElementById("AddDonarFrm").reset();
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
           }).error(function(error) {
                console.log("Error", error);
           });
        };

        $scope.clear = function(){
            console.log("calling statereload");
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
 
    }
]);
