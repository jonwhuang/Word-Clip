var app = angular.module("4564", ["ngRoute"])

app.config(function($routeProvider){
  $routeProvider.
    when('/', {
      templateUrl: 'templates/index.html'
    }).
    when('/chart', {
      templateUrl: 'templates/chart.html'
    });
})
