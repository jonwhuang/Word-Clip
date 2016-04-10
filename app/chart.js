app.controller("chartCtrl", ['$scope', '$http', '$location', '$timeout', function ($scope, $http, $location, $timeout) {

  $scope.audioUrl = "https://www.havenondemand.com/sample-content/videos/hpnext.mp4"

  // $scope.labels = [];

  // $scope.data = [];

  $scope.labels = [":10",":20",":30",":40",":50","1:00", "1:10","1:20","1:30"],

  $scope.data = [
    [-0.8294462782412093, -0.7575233110696172, -0.3573443110696172, -0.6441003110696172, 0.7570003489696172, -0.4324313110696172, -0.6234003110696172, 0.1570003110696172,1]
  ];

  $scope.chartOptions = {
    bezierCurve: false
  };


  var avergeArray = $scope.data[0]
  var total = 0;
  for(var i = 0; i < avergeArray.length; i++) {
    total += avergeArray[i];
  }
  var avg = total / avergeArray.length
  $scope.average = avg

  $scope.testSpeechRecognition = function(){
    console.log($scope.audioUrl);

    $timeout(function(){
      $location.path('/chart');
    }, 3000);

    $.ajax({
        method: 'post',
        url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1",
        data: {url:$scope.audioUrl,apikey:"4b212618-5f67-4f0d-b63a-45233c145396"}
    }).done(function(response){
        console.log(response.jobID);
        console.log('Making Job Request..')
        $.ajax({
            method: 'get',
            url: "https://api.havenondemand.com/1/job/result/" + response.jobID +"?apikey=4b212618-5f67-4f0d-b63a-45233c145396"
        }).done(function(response){
            console.log("Received job request..now pinging sentiment...")
            console.log(response);
            var string = response.actions[0].result.document[0].content;
            $('#result').html("String: "+string);
            $.ajax({
                method: 'post',
                url: "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1",
                data: {apikey:'4b212618-5f67-4f0d-b63a-45233c145396',language:'eng',text:string}
            }).done(function(response){
                $('#result').append("<br>Sentiment: " + response.aggregate.score)
                console.log(response);

            });
        });
    })
  }





}]);
