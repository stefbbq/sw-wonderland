angular.module('publicSite', [
  'angularFileUpload'
])
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
.factory('requestQuoteProvider', ['$http', '$rootScope', '$upload', function($http, $rootScope, $upload) {
  var typeList = [];
  var fakeDDContent = [];
  function getTypeList() {
    var args = {action:'typeList'};
    
    $http.jsonp($rootScope.wsURL, {
      params:args,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(result) {
      angular.copy(result.data, typeList);
      //console.log(typeList);
    }).error(function(result) {
      console.log(result);
    });
  }
  
  function getDDList() {
    var args = {action:'ddContent'};
    
    $http.jsonp($rootScope.wsURL, {
      params:args,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(result) {
      angular.copy(result.data, fakeDDContent);
    }).error(function(result) {
      console.log(result);
    });
  }
  
    /*
   * Save to Dropbox
   */
  function submitQuoteRequest(quoteData, file, onProgress, onComplete) {
    var url = $rootScope.wsDropboxURL + '?action=requestQuote';
    $('#server_response').html('');

    $upload.upload({
      url:url,
      method:'POST',
      data:quoteData,
      file:file
    }).progress(function(e) {
      if (onProgress) onProgress(e);
    }).success(function(data, status, headers, config) {
      //$('#server_response').html(data);
      onComplete();
    });
    
  }
  
    
  return {
    getTypeList:getTypeList,
    typeList:typeList,
    getFakeDDContent:getDDList,
    fakeDDContent:fakeDDContent,
    submitQuoteRequest:submitQuoteRequest
  };
}])

.controller('RequestQuoteCtrl', ['$scope', '$upload', 'requestQuoteProvider', function($scope, $upload, requestQuoteProvider) {
    $scope.provider = requestQuoteProvider;
    $scope.quote = {};
    
    function construct() {
      requestQuoteProvider.getTypeList();
      requestQuoteProvider.getFakeDDContent();
    }
    
    $scope.submit = function(quote) {
      $('.request_quote .modalCover').show();
      requestQuoteProvider.submitQuoteRequest($scope.quote, file, onUploadProgress, onQuoteSubmitted);
//      console.log(quote);
    };
    
    $scope.formatValue = function(val) {
      return val + "_a";
    };
    
    function onUploadProgress(e) {
      console.log('onUploadProgress', e);
    }
    
    function onQuoteSubmitted() {
      $('.request_quote .modalCover').hide();
      alert("Thank you for your submission.");
      angular.copy({}, $scope.quote);
    }
    
    $scope.formValidClass = function(invalid) {
      if (invalid) {
        return 'disabled';
      }
    };
    
    var file;
    $scope.onFileSelect = function(files) {
      file = files[0];
      console.log('onFileSelect', file);
    };
    
    $scope.autoFill = function() {
      console.log('autoFill');
      $scope.quote.clientName = 'Norman Osborne';
      $scope.quote.clientEmail = 'greengoblin@oscorp.com';
    }
    
    construct();
}])

;