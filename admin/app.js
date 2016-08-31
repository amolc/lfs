// Invoke 'strict' JavaScript mode

//'use strict';

// Set the main application name
var ApplicationModuleName = 'adminPanel';


// Create the main application
var SampleApplicationModule = angular.module('adminPanel', ['ui.router','ngMessages','ngAnimate','ui.bootstrap','angular-storage','ngSanitize', 'ngCsv' , 'ngAnimate', 'angularUtils.directives.dirPagination']);


SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })

    .state('mainview', {
      url: '/mainview',
      templateUrl: 'templates/mainview.html'
    })

    .state('mainview.welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html'
    })

    .state('mainview.donar', {
      url: '/donar',
      templateUrl: 'templates/donar.html'
    })

    .state('mainview.importdonor', {
      url: '/importdonor',
      templateUrl: 'templates/importdonor.html'
    })

    .state('mainview.exportdonor', {
      url: '/exportdonor',
      controller: 'donarController',
      templateUrl: 'templates/exportdonor.html'
    });

    /*.state('mainview.subcategory', {
      url: '/subcategory',
      templateUrl: 'templates/subcategory.html'
    })
    .state('mainview.subcategory2', {
      url: '/subcategory2',
      templateUrl: 'templates/subcategory2.html'
    })
    .state('mainview.products', {
      url: '/products',
      templateUrl: 'templates/products.html'
    })
    .state('mainview.details', {
      url: '/details',
      templateUrl: 'templates/details.html'
    })
    .state('mainview.about', {
      url: '/about',
      templateUrl: 'templates/about.html'
    })
    .state('mainview.contact', {
      url: '/contact',
      templateUrl: 'templates/contact.html'
    })  ;*/
}]);

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};
 
SampleApplicationModule.directive("compareTo", compareTo);


angular.module('adminPanel').controller('MainController', [
  '$scope',
  '$http',
  '$stateParams',
  '$location',
  '$rootScope',
  '$state',
  '$timeout',
  'store',
  // 'modalService',
  function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store) {

    $scope.stateParams = $stateParams;

    $scope.init = function() {
            //$scope.adminsession = $cookieStore.get('adminsession') || {};
            $scope.adminsession = store.get('adminsession') || {};
    };


    $scope.userlogin = function(user, valid) {
      if (valid) {
        $http.post(baseUrl + 'adminlogin/adminlogin', user).success(function(res, req) {
          if (res.status === true) {
            var adminsession = {
              'login': true,
              'email' : res.record[0].email,
              'id': res.record[0].id,
              'username': res.record[0].username
            }; 
            store.set('adminsession', adminsession);
            console.log("adminsession:", adminsession);
            $scope.init();
            $state.go('mainview.donar');
          } else if (res.status === false) {
            console.log("login failed");
            $scope.loginfailuremsg = 'Please Enter Valid Email Address and Password';
            $scope.showloginfailuremsg = true;
      
            // Simulate 2 seconds loading delay
            $timeout(function() {
              // Loadind done here - Show message for 3 more seconds.
              $timeout(function() {
                $scope.showloginfailuremsg = false;
              }, 3000);
              document.getElementById("loginForm").reset();
            }, 2000);
          }
        }).error(function(error) {
          console.log("Connection Problem.",error);
        });
      }

    };


    $scope.adminsignout = function() {
       //$cookieStore.remove('adminsession');
       store.remove('adminsession');
       $location.path('login');
       $scope.init();
    };

    $scope.adminsignup = function(userinfo, valid) {
      userinfo.usertype = 'admin';
      if (valid) {
        $http.post(baseUrl + 'userlogin/adminsignup', userinfo).success(function(res, req) {
          if (res.status === true) {
            $scope.signupmsg = 'User Created Successfully. Please login .';
            $scope.showsignmsg = true;
      
            $timeout(function() {
              $timeout(function() {
                $scope.showsignmsg = false;
              }, 3000);
              document.getElementById("registerForm").reset();
              //$location.path('home');
            }, 2000);
      
          } else {
            $scope.signuperrmsg = res.message;
            $scope.showsignuperrmsg = true;
      
            $timeout(function() {
              $timeout(function() {
                $scope.showsignuperrmsg = false;
              }, 3000);
              document.getElementById("registerForm").reset();
              //$location.path('login');
            }, 2000);
          }
          console.log("res:",res);
      
        }).error(function() {
          console.log("problem In signup");
        });
      }
    };

    $scope.donarstype = [
      {
        id: "1",
        type: "Platinum"
      },
      {
        id: "2",
        type: "Gold"
      },
      {
        id: "3",
        type: "Silver"
      },
      {
        id: "4",
        type: "Bronze"
      },
      {
        id: "5",
        type: "Benefactor"
      }
    ];

    $scope.donarcaterory = [
      {
        cat: "Individual Donors"
      },
      {
        cat: "Corporate Donors"
      }
    ];

  }
]);
