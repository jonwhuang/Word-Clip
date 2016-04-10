function testSpeechRecognition() {
    audio_url = document.getElementById('inputtext3').value;
    console.log(audio_url);
    $.ajax({
        method: 'post',
        url: "https://api.havenondemand.com/1/api/async/recognizespeech/v1",
        data: {url:audio_url,apikey:"4b212618-5f67-4f0d-b63a-45233c145396"}
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

};
