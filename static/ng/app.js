/*jslint browser: true */ /*globals _, angular */

var app = angular.module('app', ['ngResource', 'ngStorage', 'ui.router']);

app.controller('comparisonCtrl', function($scope, $http, $localStorage) {
  // $scope.context = 'default';

  $scope.$storage = $localStorage.$default({
    context: 'default',
  });

  // document.addEventListener('keydown', function(ev) {
  //   // console.log(ev.which, ev);
  //   // meta = command
  //   if (!ev.metaKey && !ev.altKey && !ev.ctrlKey) {
  //   }
  // });

  $scope.calls = [];

  $scope.runInContext = function(code, context_id, ev) {
    ev.preventDefault();
    $http.post('/contexts/' + context_id + '/run', {
      code: code,
    }).then(function(res) {
      console.log('success', res);
      $scope.calls.push(res.data);
    }, function(res) {
      console.error('err', res);
    });
  };
});
