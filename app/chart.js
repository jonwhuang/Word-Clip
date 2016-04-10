app.controller("chartCtrl", ['$scope', '$http', '$location', '$timeout', 'urlService', function ($scope, $http, $location, $timeout, urlService) {

  $scope.audioUrl = urlService.audioUrl;

  $scope.$watch('audioUrl', function(){
    urlService.audioUrl = $scope.audioUrl;
  })

  $scope.resultText = [];

  $scope.$on('$routeChangeSuccess', function () {
    testSpeechRecognition();
  });

  // $scope.labels = [];

  // $scope.data = [];

  $scope.labels = [":10",":20",":30",":40",":50","1:00", "1:10","1:20","1:30"],

  $scope.series = ["Conversation"]

  $scope.data = [
    [-0.8294462782412093, -0.7575233110696172, -0.3573443110696172, -0.6441003110696172, -0.7570003489696172, 0.4324313110696172, -0.6234003110696172, 0.1570003110696172,1]
  ];

  $scope.chartOptions = {
    bezierCurve: false
  }

  $scope.onHover = function(points) {
    if (points.length > 0) {
        // console.log('Point', points[0].value);
        // console.log(points[0].label);
      // } else {
        // console.log('No point');
        $('#result')[0].innerHTML = points[0].label;
        $scope.currentPoint = points[0].value.toString().slice(0,5)
        // debugger;
      };
  };


  var avergeArray = $scope.data[0]
  var total = 0;
  for(var i = 0; i < avergeArray.length; i++) {
    total += avergeArray[i];
  }
  var avg = total / avergeArray.length
  $scope.average = Math.round(avg*100)/100
  // $scope.average = avg.toString().slice(3,5) + '%';
  if (avg >= 0){
    $scope.sentiment = 'positive';
    $('#averageScore').css('background-color','green');
  } else{
    $scope.sentiment = 'negative';
    $('#averageScore').css('background-color','red');
  };


  $scope.addMoreAudio = function(){
    testSpeechRecognition();
  }

  var testSpeechRecognition = function(){
    console.log($scope.audioUrl);

    $http({
      method: 'GET',
      url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1",
      params: {url:$scope.audioUrl, apikey:"4b212618-5f67-4f0d-b63a-45233c145396"}
    })
      .error(function(response){
        console.log("Error: " + response);
      })
      .success(function(response){
        console.log(response.jobID);
        console.log('Making Job Request..')
        $http({
            method: 'GET',
            url: "https://api.havenondemand.com/1/job/result/" + response.jobID,
            params: {apikey: "4b212618-5f67-4f0d-b63a-45233c145396"}
        }).success(function(response){
            console.log("Received job request..now pinging sentiment...")
            console.log(response);
            var string = response.actions[0].result.document[0].content;
            $scope.labels.push("1:40");
            $scope.resultText.push(string);
            calculateSentiment(string);
        });
    })
  }

  var calculateSentiment = function(string){
    $http({
      method: 'POST',
      url: "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1",
      params: {apikey:'4b212618-5f67-4f0d-b63a-45233c145396',language:'eng',text:string}
    }).success(function(response){
      $scope.data[0].push(response.aggregate.score);
      console.log(response);
      console.log('T: ' + $scope.resultText);
    }).error(function(response){
      console.log("Error: " + response);
    });
  }

}]);
