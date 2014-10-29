angular.module('publicSite', [
  'angularFileUpload',
  'ui.mask'
])
.run(['$rootScope', '$location', function($rootScope, $location) {
  var forceStaging = true;
  var host = $location.host();

  if (forceStaging) host = 'wonderland-cp.stagebot.net';

  switch (host) {
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
  var dropdown = {};

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
  
  function getDDList(table, order) {
    var args = {action:'ddContent', t:table};

    if (order != null) args.order = order;
    
    $http.jsonp($rootScope.wsURL, {
      params:args,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(result) {
      angular.copy(result.data, dropdown[table]);
      console.log(table, dropdown);
    }).error(function(result) {
      console.log(result);
    });
  }

  function getRFQContent() {
    var args = {action:'getRFQDropdownContent'};

    $http.jsonp($rootScope.wsURL, {
      params:args,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(result) {
      angular.copy(result.data, dropdown);
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
    getDDList:getDDList,
    getRFQContent:getRFQContent,
    submitQuoteRequest:submitQuoteRequest,
    dropdown:dropdown
  };
}])

.controller('RequestQuoteCtrl', ['$scope', '$upload', 'requestQuoteProvider', function($scope, $upload, requestQuoteProvider) {
    $scope.provider = requestQuoteProvider;
    $scope.quote = {};
    
    function construct() {
      requestQuoteProvider.getTypeList();
      requestQuoteProvider.getRFQContent();
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
      angular.element('#file').val(null);
      //document.getElementById('file').innerHTML = document.getElementById('file').innerHTML;
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
      console.log($scope.provider.dropdown.coatingAQ);
      console.log($scope.provider.dropdown.coatingAQ[1]);

      console.log('autoFill');
      $scope.quote.clientName = 'Scott Garson';
      $scope.quote.clientEmail = 'sdgarson@gmail.com';
      $scope.quote.clientPhone = '5551234567';
      $scope.quote.type = $scope.provider.typeList[9];
      $scope.quote.size = '24 x 30';
      $scope.quote.flatSize = '24 x 30 flat';
      $scope.quote.foldedSize = '12 x 15 folded';
      $scope.quote.quantity = '1';
      $scope.quote.pageCount = '1';
      $scope.quote.coatingAQ = $scope.provider.dropdown.coatingAQ[1];
      $scope.quote.coatingVarnish = requestQuoteProvider.dropdown.coatingVarnish[1];
      $scope.quote.finish = requestQuoteProvider.dropdown.finish[1];
      $scope.quote.weightText = requestQuoteProvider.dropdown.weightText[1];
      $scope.quote.weightCover = requestQuoteProvider.dropdown.weightCover[1];
      $scope.quote.recycled = requestQuoteProvider.dropdown.recycle[1];
      $scope.quote.colours = requestQuoteProvider.dropdown.colours[4];
      $scope.quote.sides = requestQuoteProvider.dropdown.sides[0];
      $scope.quote.specialFX = requestQuoteProvider.dropdown.sfx[1];
      $scope.quote.binding = requestQuoteProvider.dropdown.binding[1];
      $scope.quote.description = 'A poster for my collection';



    }
    
    construct();
}])


;