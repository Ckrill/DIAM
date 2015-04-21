$( document ).ready(function() {
    function loadQuestion(){
        var tmdb = 'http://api.themoviedb.org/3/',
        mode = 'movie/top_rated?',
        TopMovieRange = 1000, // Top 1000?
        minimumVotes = 150,  // Minimum 150 votes (Det tager lidt tid før nyere film kommer derop.)
        page = "&page="+Math.floor((Math.random() * (TopMovieRange/20)) + 1), // Dataen er delt op i "sider" (json filer), med 20 film i hver.
        key = '&api_key=83b296315507b7ea0ccdcc536a5ab745',
        url = tmdb+mode+page+key;
        $.getJSON(url, function (json) {
            console.log(json);
            function randomMovie(){
                voteCount = json.results[[0]].vote_count,
                title = json.results[[0]].title,
                arr = [];
                while(arr.length < 2){
                  var randomNumber=Math.ceil(Math.random()*18)
                  var found=false;
                  for(var i=0;i<arr.length;i++){
                    if(arr[i]==randomNumber){found=true;break}
                  }
                  if(!found)arr[arr.length]=randomNumber;
                }
                var idMovie = json.results[arr[0]].id,
                voteCount = json.results[arr[0]].vote_count,
                title = json.results[arr[0]].title,
                idAltMovie = json.results[arr[1]].id;

                if (voteCount < minimumVotes){
                    randomMovie();
                    return;
                }else{
                    var randomNumber = Math.round(Math.random());
                    $('#title').text(title);                         
                    var mode = 'movie/'+idMovie+"/credits",
                    key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                    urlById = tmdb+mode+key;
                    $.getJSON(urlById, function (json) {
                        console.log(json);
                        var actor = json.cast[0].name,
                        character = json.cast[0].character;
                        if (randomNumber == 0){
                            $('#right').text(actor);
                            $('#right').addClass("1");
                            $('#left').removeClass("1");
                            
                        }else{
                            $('#left').text(actor);
                            $('#left').addClass("1");
                            $('#right').removeClass("1");
                        }
                        $('#character').text(character);
                    });
                    var mode = 'movie/'+idAltMovie+"/credits",
                    key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                    urlByIdAlt = tmdb+mode+key;
                    $.getJSON(urlByIdAlt, function (json) {
                        console.log(json);
                        var actorAlt = json.cast[0].name;
                        if (randomNumber == 1){
                            $('#right').text(actorAlt);
                        }else{
                            $('#left').text(actorAlt);
                        }
                        return;
                    });
                }
            }
            randomMovie();
        });
        $("#right, #left").unbind().click(function() {
            if ($(this).hasClass("1")) {
                scoreCounter();
            }
            loadQuestion();
        });
    }
    loadQuestion();
});
var count=60;
var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
function timer()
{
  count=count-1;
  if (count < 0)
  {
     clearInterval(counter);
     var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
     if(score >= retrivedValue){
        localStorage.setItem('LocalStorageKey', score);
        var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
        alert("NY HIGHSCORE!! Din highscore er "+retrivedValue);
     }else{
         alert("Din highscore er "+retrivedValue);
     }
     location.reload();
     return;
  }
document.getElementById("time").innerHTML=count + " secs";
}

var score = 0;
function scoreCounter(){
    score = score+1;
    document.getElementById("score").innerHTML=score+"";
}
function saveScore(){
    
}