// Options
var correctAnswerClass = "correct",

// Database variables
tmdb = 'http://api.themoviedb.org/3/',
key = '&api_key=83b296315507b7ea0ccdcc536a5ab745',
flag = 0;
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
    var mode = 'movie/top_rated?',
    TopMovieRange = 1000, // Top 1000?
    minimumVotes = 250,  // Minimum 150 votes (Det tager lidt tid før nyere film kommer derop.)
    page = "&page="+Math.floor((Math.random() * (TopMovieRange/20)) + 1), // Dataen er delt op i "sider" (json filer), med 20 film i hver.
    url = tmdb+mode+page+key;
    $.getJSON(url, function (json) {
        console.log(json);
        function randomMovie() {
            voteCount = json.results[[0]].vote_count,
            title = json.results[[0]].title,
            arr = [];
            while(arr.length < 2){
              var randomNumber = Math.ceil(Math.random() * 18);
              var found = false;
              for (var i = 0;i<arr.length;i++) {
                if (arr[i] == randomNumber){found = true;break}
              }
              if (!found)arr[arr.length] = randomNumber;
            }
            var idMovie = json.results[arr[0]].id,
            voteCount = json.results[arr[0]].vote_count,
            title = json.results[arr[0]].title,
            idAltMovie = json.results[arr[1]].id;

            if (voteCount < minimumVotes) {
                randomMovie();
                return;
            } else {
                var randomNumber = Math.round(Math.random());
                $('#title').text(title);                         
                var mode = 'movie/'+idMovie+"/credits",
                key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                urlById = tmdb+mode+key;
                $.getJSON(urlById, function (json) {
                    console.log(json);
                    var actor = json.cast[0].name,
                    character = json.cast[0].character;
                    if (randomNumber == 0) {
                        $('.right p').text(actor).addClass(correctAnswerClass);
                        $('.left p').removeClass(correctAnswerClass);

                    } else {
                        $('.left p').text(actor).addClass(correctAnswerClass);
                        $('.right p').removeClass(correctAnswerClass);
                    }
                    if (character.indexOf("(voice)") >= 0) {
                        $("body").addClass("voice");
                        var character = character.replace(" (voice)", "");
                    } else {
                        $("body").removeClass("voice");
                    }
                    $('#character').text(character);
                });
                var mode = 'movie/'+idAltMovie+"/credits",
                urlByIdAlt = tmdb+mode+key;
                $.getJSON(urlByIdAlt, function (json) {
                    console.log(json);
                    var actorAlt = json.cast[0].name;
                    if (randomNumber == 1) {
                        $('.right p').text(actorAlt);
                    } else {
                        $('.left p').text(actorAlt);
                    }
                    return;
                });
            }
        }
        randomMovie();
    });
}

function whichMovie(){
    $("body").removeClass("whichActor").addClass("whichMovie");
    var mode = 'discover/movie?',
    page = '&page=1',
    currentYear = new Date().getFullYear(),
    year = Math.floor(Math.random() * (currentYear - (currentYear - 20) + 1) + (currentYear - 20)),
    query = "&primary_release_year="+year+".desc&sort_by=popularity.desc", // Dataen er delt op i "sider" (json filer), med 20 film i hver.    
    urlMovie = tmdb+mode+page+key+query;
    $.getJSON(urlMovie, function (json) {
        console.log(json);
        var randomNumber = Math.floor(Math.random() * (19 - 0 + 1)) + 0;
        var title = json.results[randomNumber].title,
        range = 1,
        yearAlt = (Math.round(Math.random()) * 2 - 1);
        if (year == currentYear) {
            yearAlt = year - range;
        } else if (year > currentYear - 3) {
            yearAlt = year + yearAlt;
        } else if ((year<currentYear - 3) && (year > currentYear - 12)){
            range = 2;
            yearAlt = year+(yearAlt*range);
        } else {
            range = 3;
            yearAlt = year+(yearAlt*range);
        }
        if (randomNumber == 0) {
            $('.right p').text(yearAlt);
            $('.left p').text(year);
            $('.left p').addClass(correctAnswerClass);
            $('.right p').removeClass(correctAnswerClass);

        } else {
            $('.left p').text(yearAlt);
            $('.right p').text(year);
            $('.right p').addClass(correctAnswerClass);
            $('.left p').removeClass(correctAnswerClass);
        }
        $('#releaseTitle').text(title);
    });
}

var score = 0;
function scoreCounter(){
    score = score + 1;
    $("#score").text(score);
}

function saveScore(){
    var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
    if (score >= retrivedValue) {
        localStorage.setItem('LocalStorageKey', score);
        var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
        console.log("NY HIGHSCORE!! Din highscore er "+retrivedValue);
    } else {
        console.log("Din highscore er "+retrivedValue);
    }
}

// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false,
        infinite: false
    });
}
// Initiate slider - END

// Set height of Slider
function setSlideHeight() {
    var windowHeight = $(window).height();
    console.log(windowHeight);
    $(".page").css("height", windowHeight + "px");
}
// Set height of Slider - END

// Return slider to middle page
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
// Return slider to middle page - END

function timer() {
$("#DateCountdown").TimeCircles({
    "animation": "smooth",
    "bg_width": 1.2,
    "fg_width": 0.1,
    "circle_bg_color": "rgba(0, 0, 0, .0)",
    "time": {
        "Days": {
            "show": false
        },
        "Hours": {
            "show": false
        },
        "Minutes": {
//            "show": false
            "show": true
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
    // Check on click
    $(".right, .left").unbind().click(function() {
        if ($(this).children("p").hasClass(correctAnswerClass)) {
            scoreCounter();
        }
        questionType();
    });
    
    // Check on slide
    $('.slide-container').on('afterChange', function(event, slick){
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        
        var correctAnswer = $("." + correctAnswerClass).closest();
        if($("." + correctAnswerClass).closest("div").hasClass("left")){
            correctAnswer = 0;
            console.log(correctAnswer);
        } else if($("." + correctAnswerClass).closest("div").hasClass("right")){
            correctAnswer = 2;
            console.log(correctAnswer);
        }
        
        if (currentSlide === correctAnswer) {
            scoreCounter();
        }
        questionType();
    });
}

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