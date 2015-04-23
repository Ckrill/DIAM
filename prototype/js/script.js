function questionType(){
    flag = flag+1;
    if (flag>3){
        flag = 0;
        whichMovie();
    }else{
        whichActor();
    }
}

function whichActor(){
    $("body").removeClass("whichMovie");
    var tmdb = 'http://api.themoviedb.org/3/',
    mode = 'movie/top_rated?',
    TopMovieRange = 1000, // Top 1000?
    minimumVotes = 250,  // Minimum 150 votes (Det tager lidt tid før nyere film kommer derop.)
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
              var randomNumber=Math.ceil(Math.random()*18);
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
                    if(character.indexOf("(voice)") >= 0){
                        $("body").addClass("voice");
                        var character = character.replace(" (voice)", "");
                    }else{
                        $("body").removeClass("voice");
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
}

function whichMovie(){
    $("body").removeClass("whichActor");
    $("body").addClass("whichMovie");
    var tmdb = 'http://api.themoviedb.org/3/',
    mode = 'discover/movie?',
    page = '&page=1',
    currentYear = new Date().getFullYear(),
    year = Math.floor(Math.random()*(currentYear-(currentYear-20)+1)+(currentYear-20)),
    query = "&primary_release_year="+year+".desc&sort_by=popularity.desc", // Dataen er delt op i "sider" (json filer), med 20 film i hver.    
    key = '&api_key=83b296315507b7ea0ccdcc536a5ab745',
    urlMovie = tmdb+mode+page+key+query;
    $.getJSON(urlMovie, function (json) {
        console.log(json);
        var randomNumber = Math.floor(Math.random() * (19 - 0 + 1)) + 0;
        var title = json.results[randomNumber].title,
        range = 1,
        yearAlt = (Math.round(Math.random()) * 2 - 1);
        if (year == currentYear){
            yearAlt = year-range;
        }
        else if (year>currentYear-3){
            yearAlt = year+yearAlt;
        }
        else if ((year<currentYear-3) && (year>currentYear-12)){
            range = 2;
            yearAlt = year+(yearAlt*range);
        }
        else{
            range = 3;
            yearAlt = year+(yearAlt*range);
        }
        if (randomNumber == 0){
            $('#right').text(yearAlt);
            $('#left').text(year);
            $('#left').addClass("1");
            $('#right').removeClass("1");

        }else{
            $('#left').text(yearAlt);
            $('#right').text(year);
            $('#right').addClass("1");
            $('#left').removeClass("1");
        }
        $('#releaseTitle').text(title);
    });
}

var score = 0;
function scoreCounter(){
    score = score+1;
    document.getElementById("score").innerHTML=score+"";
}

function saveScore(){
    var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
    if(score >= retrivedValue){
        localStorage.setItem('LocalStorageKey', score);
        var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
        console.log("NY HIGHSCORE!! Din highscore er "+retrivedValue);
    }else{
        console.log("Din highscore er "+retrivedValue);
    }
}

function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false,
        infinite: false
    });
}

function setSlideHeight() {
    var windowHeight = $(window).height();
    console.log(windowHeight);
    $(".page").css("height", windowHeight + "px");
}

function resetSliderPage() {
    $('.slide-container').on('afterChange', function(event, slick, direction){
        console.log("Direction: " + direction);
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide != 1) {
            setTimeout(function() {
                $('.slide-container').slick("slickSetOption", "speed", "0");
                $('.slide-container').slick("slickGoTo", 1);
                $('.slide-container').slick("slickSetOption", "speed", "300");
                console.log("Going back to the middle slide!");
            }, 100);
        }
    });
}

function timer() {
$("#DateCountdown").TimeCircles({
    "animation": "smooth",
    "bg_width": 1.2,
    "fg_width": 0.1,
    "circle_bg_color": "#fff",
    "time": {
        "Days": {
            "show": false
        },
        "Hours": {
            "show": false
        },
        "Minutes": {
            "show": false
        },
        "Seconds": {
            "text": "",
            "color": "#333",
            "show": true
        }

    }
    }).addListener(function(unit, amount, total){
        if(total == 0) {
            saveScore();
            location.reload();
        }
    });
}
function answerChecker() {
    $("#right, #left").unbind().click(function() {
        if ($(this).hasClass("1")) {
            scoreCounter();
        }
        questionType();
    });
}


var flag = 0;

$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    resetSliderPage();
    questionType();
    timer();
    answerChecker();
});

// Ready - END

// Scroll
$(window).scroll(function () {
});
// Scroll - END


// Resize
$(window).resize(function () {
    setSlideHeight();
});
//Resize - END