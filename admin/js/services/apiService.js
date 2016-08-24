//angular.module('').factory( 'factoryName', function );
var app = angular.module('adminPanel');

app.factory('ApiService', function($http, $q) {
  var factory = {};

  factory.getcategories = function() {
    var deferred = $q.defer();
    return $http.post(baseUrl + 'category/getcategories')
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  factory.getsubcategories = function() {
    var deferred = $q.defer();
    return $http.post(baseUrl + 'category/getsubcategories')
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  factory.deletecategory = function(category) {
      var deferred = $q.defer();
    return $http.post(baseUrl + 'category/deletecategory', category)
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  factory.deletesubcategory = function(sub_category) {
      var deferred = $q.defer();
    return $http.post(baseUrl + 'category/deletesubcategory', sub_category)
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  factory.updatecategory = function(category) {
    var deferred = $q.defer();
    return $http.post(baseUrl + 'category/updatecategory', category)
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  factory.updatesubcategory = function(sub_category) {
    var deferred = $q.defer();
    return $http.post(baseUrl + 'category/updatesubcategory', sub_category)
      .then(function(response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        return deferred.promise;
      }, function(response) {
        // the following line rejects the promise
        deferred.reject(response);
        return deferred.promise;
      });
  };

  return factory;
});
