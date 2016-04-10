app.controller("chartCtrl", ['$scope', '$http', '$location', '$timeout', 'Upload', 'urlService', 'uploadService', function ($scope, $http, $location, $timeout, Upload,urlService, uploadService) {

  $scope.audioUrl = urlService.audioUrl;

  $scope.$watch('audioUrl', function(){
    urlService.audioUrl = $scope.audioUrl;
  })

  $scope.audioFile = uploadService.audioFile;

  // $scope.resultText = [];

  $scope.$on('$routeChangeSuccess', function () {
    testSpeechRecognition();
  });

  // $scope.labels = [];
  var labelCounter = 9
  // $scope.data = [];

  $scope.labels = [1,2,3,4,5,6,7,8,9],

  // $scope.lables.forEach
  $scope.series = ["Conversation"]

  $scope.data = [
  [-0.8294462782412093, -0.7575233110696172, -0.3573443110696172, -0.6441003110696172, -0.7570003489696172, 0.4324313110696172, -0.6234003110696172, 0.1570003110696172,1]
  ];
  $scope.resultText = [
  'hello1','hello2', 'hello3','hello4','hello5', 'hello6','hello7','hello8', 'hello9'
  ];
  $scope.chartOptions = {
    bezierCurve: false,
    showTooltips: false
  }

  $scope.onHover = function(points) {
    console.log(points)
    if (points.length > 0) {
        // console.log('Point', points[0].value);
        // console.log(points[0].label);
      // } else {
        // console.log('No point');
        // debugger;
        $('#result')[0].innerHTML = $scope.resultText[points[0].label];
        $scope.currentPoint = points[0].value.toString().slice(0,5)
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
    var params;

    if ($scope.audioFile !== "") {
      console.log('found a file');
      Upload.upload({
        url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1", 
        data: {file:$scope.audioFile, apikey:"4b212618-5f67-4f0d-b63a-45233c145396"}
      })
      .error(function(response){
        console.log("Error: " + response);
      })
      .success(function(response){
        console.log('Making Job Request..')
        $http({
          method: 'GET',
          url: "https://api.havenondemand.com/1/job/result/" + response.jobID,
          params: {apikey: "4b212618-5f67-4f0d-b63a-45233c145396"}
        })
        .success(function(response) {
          console.log("Audio File working hard")
          var string = response.actions[0].result.document[0].content;
          labelCounter += 1;
          $scope.labels.push(labelCounter);
          $scope.resultText.push(string);
          calculateSentiment(string);
        })
      })
    } else {
      $http({
        method: 'GET',
        url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1",
        params: {url: $scope.audioUrl, apikey: "4b212618-5f67-4f0d-b63a-45233c145396"}
      })
      .error(function(response){
        console.log("Error: " + response);
      })
      .success(function(response){
        console.log('Making Job Request..')
        $http({
          method: 'GET',
          url: "https://api.havenondemand.com/1/job/result/" + response.jobID,
          params: {apikey: "4b212618-5f67-4f0d-b63a-45233c145396"}
        }).success(function(response){
          console.log("Received job request..now pinging sentiment...")
          console.log(response);
          var string = response.actions[0].result.document[0].content;
          labelCounter += 1;
          $scope.labels.push(labelCounter);
          $scope.resultText.push(string);
          calculateSentiment(string);
        });
      })
    }
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


