app.controller("chartCtrl", ['$scope', '$http', '$location', '$timeout', 'urlService', function ($scope, $http, $location, $timeout, urlService) {

  $scope.audioUrl = urlService.audioUrl;

  $scope.$watch('audioUrl', function(){
    urlService.audioUrl = $scope.audioUrl;
  })

  // $scope.resultText = [];

  // $scope.$on('$routeChangeSuccess', function () {
  //   testSpeechRecognition();
  // });

  // $scope.labels = [];
var labelCounter = 8;
  // $scope.data = [];

  $scope.labels = [0,1,2,3,4,5,6,7],

  $scope.series = ["Conversation"]
  $scope.resultText = [" "]
  $scope.data = [
    [0]
  ];
  var sampleText = [
    "He asked me a few questions about my object in coming, my antecedents generally, the mode in which I afterwards proposed to use the knowledge I might acquire, and finally, whether I wished to study any special branch. To the latter I replied that while I wished to be well grounded in all departments of zoology, I purposed to devote myself specially to insects. 'When do you wish to begin?' he asked. 'Now,' I replied. This seemed to please him, and with an energetic 'Very well,' he reached from a shelf a huge jar of specimens in yellow alcohol. ",
    "'Take this fish,' said he, 'and look at it; we call it a haemulon; by and by I will ask what you have seen.' With that he left me, but in a moment returned with explicit instructions as to the care of the object entrusted to me. 'No man is fit to be a naturalist,' said he, 'who does not know how to take care of specimens.' I was to keep the fish before me in a tin tray,and occasionally moisten the surface with alcohol from the jar, always taking care to replace the stopper tightly. Those were not the days of ground glass stoppers, and elegantly shaped exhibition jars; all the old students will recall the huge, neckless glass bottles with their leaky, wax-besmeared corks, half eaten by insects and begrimed with cellar dust.",
    "Entomology was a cleaner science than ichthyology, but the example of the professor, who had unhesitatingly plunged to the bottom of the jar to produce the fish, was infectious; and though this alcohol had 'a very ancient and fish-like smell,' I really dared not show any aversion within these sacred precincts, and treated the alcohol as though it were pure water. Still I was conscious of a passing feeling of disappointment, for gazing at a fish did not commend itself to an ardent entomologist. My friends at home, too, were annoyed, when they discovered that no eau de cologne would drown the perfume which haunted me like a shadow.",
    "In ten minutes I had seen all that could be seen in that fish, and started in search of the professor, who had however left the museum; and when I returned, after lingering over some of the odd animals stored in the upper apartment, my specimen was dry all over. I dashed the fluid over the fish as if to resuscitate the beast from a fainting fit, and looked with anxiety for a return of the normal, sloppy appearance. This little excitement over, nothing was to be done but return to a steadfast gaze at my mute companion. Half an hour passed--an hour--another hour; the fish began to look loathsome. I turned it over and around; looked it in the face--ghastly; from behind, beneath, above, sideways, at a three-quarters view--just as ghastly. ",
    "I was in despair; at an early hour I concluded that lunch was necessary; so, with infinite relief, the fish was carefully replaced in the jar, and for an hour I was free. On my return, I learned that Professor Agassiz had been at the museum, but had gone and would not return for several hours. My fellow-students were too busy to be disturbed by continued conversation. Slowly I drew forth that hideous fish, and with a feeling of desperation again looked at it. I might not use a magnifying glass; instruments of all kinds were interdicted. My two hands, my two eyes, and the fish: it seemed a most limited field. I pushed my finger down its throat to feel how sharp the teeth were. I began to count the scales in the different rows until I was convinced that that was nonsense. At last a happy thought struck me--I would draw the fish; and now with surprise I began to discover new features in the creature. Just then the professor returned. 'That is right,' said he; 'a pencil is one of the best of eyes. I am glad to notice, too, that you keep your specimen wet, and your bottle corked.' With these encouraging words, he added, 'Well, what is it like?' ",
    "He listened attentively to my brief rehearsal of the structure of parts whose names were still unknown to me; the fringed gill-arches and movable operculum; the pores of the head, fleshy lips and lidless eyes; the lateral line, the spinous fins, and forked tail; the compressed and arched body. When I had finished, he waited as if expecting more, and then, with an air of disappointment: 'You have not looked very carefully; why,' he continued, more earnestly, 'you haven't even see one of the most conspicuous features of the animal, which is as plainly before your eyes as the fish itself; look again, look again!' and he left me to my misery. I was piqued; I was mortified. Still more of that wretched fish! But now I set myself to my task with a will, and discovered one new thing after another, until I saw how just the professor's criticism had been. The afternoon passed quickly, and when, towards its close, the professor inquired: 'Do you see it yet?' 'No,' I replied, 'I am certain I do not, but I see how little I saw before.' 'That is the next best,' said he earnestly, 'but I won't hear you now; put away your fish and go home; perhaps you will be ready with a better answer in the morning.",
    "I will examine you before you look at the fish.' This was disconcerting; not only must I think of my fish all night, studying without the object before me, what this unknown but most visible feature might be; but also, without reviewing my new discoveries, I must give an exact account of them the next day. I had a bad memory; so I walked home by the Charles River in a distracted state, with my two perplexities. The cordial greeting from the professor the next morning was reassuring; here was a man who seemed to be quite as anxious as I that I should see for myself what he saw. 'Do you perhaps mean,' I asked, 'that the fish has symmetrical sides with paired organs?' His thoroughly pleased 'Of course! of course!' repaid the wakeful hours of the previous night. After he had discoursed most happily and enthusiastically--as he always did--upon the importance of this point, I ventured to ask what I should do next. 'Oh, look at your fish!' he said, and left me again to my own devices."
  ];

  sampleText.forEach(function(text){
    calculateSentiment(text);
  });

  $scope.chartOptions = {
    bezierCurve: false,
    showTooltips: false
  }

  $scope.onHover = function(points) {
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


  var averageArray = $scope.data[0]
  var total = 0;
  for(var i = 0; i < averageArray.length; i++) {
    total += averageArray[i];
  }
  var avg = total / averageArray.length
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
      // console.log(response);
      // console.log('T: ' + $scope.resultText);

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

}]);
