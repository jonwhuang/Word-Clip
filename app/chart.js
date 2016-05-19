app.controller("chartCtrl", ['$scope', '$http', 'Upload', 'urlService', function ($scope, $http, Upload,urlService) {

  $scope.audioUrl = urlService.audioUrl;

  $scope.$watch('audioUrl', function(){
    urlService.audioUrl = $scope.audioUrl;
  })

  var labelCounter = 8;

  $scope.labels = [0,1,2,3,4,5,6,7],

  $scope.series = ["Conversation"]
  $scope.resultText = [" "]
  $scope.data = [
  [0]
  ];

  var sampleText = [];

  $scope.sampleText = sampleText.join(' ');

  sampleText.forEach(function(text){
    calculateSentiment(text);
  });

  $scope.chartOptions = {
    bezierCurve: false,
    showTooltips: false
  }

  $scope.onHover = function(points) {
    if (points.length > 0) {
      $('#result')[0].innerHTML = $scope.resultText[points[0].label];
      $scope.currentPoint = points[0].value.toString().slice(0,5)
    };
  };


  var averageArray = $scope.data[0]
  var total = 0;
  for(var i = 0; i < averageArray.length; i++) {
    total += averageArray[i];
  }
  var avg = total / averageArray.length
  $scope.average = Math.round(avg*100)/100


  if (avg >= 0){
    $scope.sentiment = 'positive';
    $('#averageScore').css('background-color','green');
  } else{
    $scope.sentiment = 'negative';
    $('#averageScore').css('background-color','red');
  };


  $scope.addMoreAudio = function(){
    testSpeechRecognition();
    var spinner = new Spinner().spin();
    $('.line-legend-icon')[0].appendChild(spinner.el);
    $('.line-legend-text')[0].innerHTML = '<br><br><br>Loading';
  }

  var testSpeechRecognition = function(){
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
        var string = response.actions[0].result.document[0].content;
        $scope.labels.push(labelCounter);
        labelCounter += 1;
        calculateSentiment(string);
      });
    })
  }

  function calculateSentiment(string){
    $http({
      method: 'POST',
      url: "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1",
      params: {apikey:'4b212618-5f67-4f0d-b63a-45233c145396',language:'eng',text:string}
    }).success(function(response){
      var updated_string = string;
      response.positive.forEach(function(positive){
        updated_string = boldWords(updated_string, positive.sentiment);
      });
      response.negative.forEach(function(negative){
        updated_string = redWords(updated_string, negative.sentiment);
      });
      $scope.resultText.push(updated_string);
      $scope.data[0].push(response.aggregate.score);
    }).error(function(response){
      console.log("Error: " + response);
    });
  }


  function boldWords(input, target) {
    return input.replace(new RegExp('(^|\\s)(' + target + ')(\\s|$)','ig'), '$1<font color="blue"><b>$2</b></font>$3');
  };

  function redWords(input, target) {
    return input.replace(new RegExp('(^|\\s)(' + target + ')(\\s|$)','ig'), '$1<font color="red">$2</font>$3');
  };

  $scope.submit = function() {

      $scope.upload($scope.file);

  };

  $scope.upload = function(file) {
    var spinner = new Spinner().spin();
    $('.line-legend-icon')[0].appendChild(spinner.el);
    $('.line-legend-text')[0].innerHTML = '<br><br><br>Loading';
    Upload.upload({
      url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1",
      data: {file:file[0], apikey:"4b212618-5f67-4f0d-b63a-45233c145396"}
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
  }

}]);


