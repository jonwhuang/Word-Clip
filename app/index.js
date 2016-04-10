var app = angular.module("4564", ["ng" ,"ngRoute", "chart.js"])

app.config(function($routeProvider){
  $routeProvider.
    when('/', {
      templateUrl: 'templates/index.html',
      controller: "homeCtrl"
    }).
    when('/chart', {
      templateUrl: 'templates/chart.html',
      controller: "chartCtrl"
    });
})

app.controller('homeCtrl', ['$scope', 'urlService', function($scope, urlService){

  $scope.audioUrl = urlService.audioUrl;

  $scope.$watch('audioUrl', function(){
    urlService.audioUrl = $scope.audioUrl;
  })

  $scope.background = true;
    console.log($scope.background);

}]);

app.service('urlService', function(){

  var self = this;
  this.audioUrl = "https://www.havenondemand.com/sample-content/videos/hpnext.mp4";

  this.getAudioUrl = function(){
    return self.audioUrl
  }
})
