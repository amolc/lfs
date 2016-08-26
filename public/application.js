// Invoke 'strict' JavaScript mode
'use strict';

// Set the main application name
var ApplicationModuleName = 'Lfs';


// Create the main application
var SampleApplicationModule = angular.module('Lfs', ['ui.router', 'angular-storage', 'ngMessages','ui.bootstrap','ngAnimate']);

/*SampleApplicationModule.run(function($rootScope, AuthService, $state, $location, store) {

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authRequired && !AuthService.isAuthenticated) {
            $state.go("signin");
            event.preventDefault();
        } else {
            if (toState.url == '/signin' && AuthService.isAuthenticated) {
                $location.path("home");
            }
        }
    });
})




.directive('compareTo', ['$parse', function($parse) {
    return {
        restrict: 'A',
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
}])
*/
SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider', 'storeProvider', function($urlRouterProvider, $stateProvider, storeProvider) {
    //  storeProvider.setStore('sessionStorage');
    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    })

    .state('donars', {
        url: '/donars',
        templateUrl: 'templates/donars.html'
    })

    .state('brochure', {
        url: '/brochure',
        templateUrl: 'templates/brochure.html'
    })

    .state('donation', {
        url: '/donation',
        templateUrl: 'templates/donation.html',
    })



}]);

angular.module('Lfs').directive('validFile', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel) {
            el.bind('change', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    }
});

angular.module('Lfs').controller('MainController', [
    '$scope',
    '$http',
    '$stateParams',
    '$location',
    '$rootScope',
    '$state',
    '$timeout',
    'store',
    '$sce',
    '$window',
    '$modal',
    '$log',
    function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store, $sce, $window , $modal , $log) {
        $scope.userSession = store.get('userSession') || {};

        $scope.init = function() {

        };


        $scope.currState = $state;
        $scope.$watch('currState.current.name', function(newValue, oldValue) {
            $scope.isstate = newValue;
        });

        $scope.demo = {
            showTooltip: true,
            tooltipDirection: 'right'
        };

        // modal text
        $scope.ny_logtype = $sce.trustAsHtml('Har ert boende ingen egen logotyp eller är det dags att förnya den ni har? En modern och professionell logotyp stärker samhörigheten och engagemanget inom boendet.<br><br>Genom boappa kan ni snabbt och enkelt få en ny och snygg logotyp. Klicka på "Läs mer" för att se exempel och pris.');
        
        $scope.flag = 1;
        $scope.donortype = 'Individual Donors';

        $scope.getalldonarlist = function(){
               $http.get(baseUrl + 'donar/getalldonarlist').success(function(res, req){
                    $scope.alldonorList1 = res;
                    var filtercategory = _.where(res,{'donortype':$scope.donortype});
                    $scope.alldonorList = filtercategory;
                    
               }).error(function(error) {
                    console.log("Error", error);
               });
        };
        $scope.getalldonarlist();

        $scope.setflag = function(flag){
            if(flag === 1){
                $scope.donortype = 'Individual Donors';
            } else {
                $scope.donortype = 'Corporate Donors';
            }
            var filtercategory = _.where($scope.alldonorList1,{'donortype':$scope.donortype});
             $scope.alldonorList = filtercategory;
        }
         $scope.imageURL = imageURL;

         $scope.showPopover=false; 

         $scope.callingover =  function(obj){
            console.log("abc:",obj);
            console.log("calling hover....");
           $scope.popover = {
                title: obj.donorname,
                message: obj.preftitle
            };
               
        }

            
    }
]);