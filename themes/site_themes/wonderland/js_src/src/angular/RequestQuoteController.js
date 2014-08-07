angular.module('publicSite', [])
.run(['$rootScope', '$location', function($rootScope, $location) {
  switch ($location.host()) {
    case 'wonderland-cp.stagebot.net':
      $rootScope.wsURL = 'http://wonderland-cp.stagebot.net/webservice/WPLAdmin.php?callback=JSON_CALLBACK';
      $rootScope.wsUploadURL = 'http://wonderland-cp.stagebot.net/webservice/WPLAdmin.php';
      $rootScope.wsDropboxURL = 'http://wonderland-cp.stagebot.net/webservice/WPLAdmin.php';
      break;
    case 'localhost':
      $rootScope.wsURL = 'http://localhost:81/wonderlandws/WPLAdmin.php?callback=JSON_CALLBACK';
      $rootScope.wsUploadURL = 'http://localhost:81/wonderlandws/WPLAdmin.php';
      $rootScope.wsDropboxURL = 'http://wonderland-cp.stagebot.net/webservice/WPLAdmin.php';
      break;
  }
}])
.factory('typeProvider', ['$http', '$rootScope', function($http, $rootScope) {
  var typeList = [];
  function getTypeList() {
    var args = {action:'typeList'};
    
    $http.jsonp($rootScope.wsURL, {
      params:args,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(result) {
      angular.copy(result.data, typeList);
      console.log(typeList);
    }).error(function(result) {
      console.log(result);
    });
  }
  
  
    
  return {
    getTypeList:getTypeList,
    typeList:typeList
  };
}])

.controller('RequestQuoteCtrl', ['$scope', 'typeProvider', function($scope, typeProvider) {
    $scope.typeProvider = typeProvider;
    $scope.typeList = typeProvider.typeList;
    
    $scope.quote = {};
    
    
    function construct() {
      typeProvider.getTypeList();
    }
    
    construct();
}])

;