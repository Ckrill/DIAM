/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

// Variables
var tutorialMode,
    
// Options
    correctAnswerClass = "correct",
    falseAnswerClass = "false",

// JSON
    tmdb = 'http://api.themoviedb.org/3/',
    key = '&api_key=83b296315507b7ea0ccdcc536a5ab745',
    flag = 0;
// Variables - END

// Question type
function questionType() {
    flag = flag + 1;
    if (flag > 3) {
        flag = 0;
        whichMovie();
    } else {
        whichActor();
    }
}
// Question type - END

// Vibrate
function startVibrate(level) {
    if ("vibrate" in navigator) { // If vibration is supported
        navigator.vibrate(level);
    }
}
// Vibrate - END

// Reset feedback
function feedbackReset() {
    $('.feedback, .answer').removeClass(correctAnswerClass + " " + falseAnswerClass);
}
// Reset feedback - END

// Reset question
function questionReset() {
    $('.question, .answer').html("");
}
// Reset question - END

// Set answer
function setAnswer(correctAnswer, actor) {
    var falseAnswer;
    if (correctAnswer === "left") {
        falseAnswer = "right";
    } else {
        falseAnswer = "left";
    }
    $('.answer.' + correctAnswer).html("<p>" + actor + "</p>");
    $('.feedback.' + correctAnswer + ', .answer.' + correctAnswer).addClass(correctAnswerClass);
    $('.feedback.' + falseAnswer).addClass(falseAnswerClass);
}
// Set answer - END

// Question type: What actor
function whichActor() {
    $("body").removeClass("whichMovie");
    var mode = 'movie/top_rated?',
        TopMovieRange = 1000, // Top 1000
        minimumVotes = 200,  // Minimum 150 votes
        page = "&page=" + Math.floor((Math.random() * (TopMovieRange / 20)) + 1), 
        url = tmdb + mode + page + key;
    $.getJSON(url, function (json) {
        function randomMovie() {
            var voteCount = json.results[[0]].vote_count,
                title = json.results[[0]].title,
                arr = [];
            while (arr.length < 2) {
                var randomNumber = Math.ceil(Math.random() * 19), 
                    found = false,
                    i;
                for (i = 0; i < arr.length; i++) {
                    if (arr[i] === randomNumber) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    arr[arr.length] = randomNumber;
                }
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
                var mode = 'movie/' + idMovie + "/credits",
                    key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                    urlById = tmdb + mode + key;
                $.getJSON(urlById, function (json) { // Get movie
                    var actor = json.cast[0].name,
                        character = json.cast[0].character;
                    feedbackReset();
                    // Inset correct answer
                    if (randomNumber === 0) {
                        setAnswer("right", actor);
                    } else {
                        setAnswer("left", actor);
                    }
                    
                    // Inset question
                    var question;
                    question = "<p class='whichActorparagraf'>Who ";
                    if (character.indexOf("(voice)") >= 0) {
                        question = question + "<span class='voiced'>voiced</span>"
                        var character = character.replace(" (voice)", "");
                    } else {
                        question = question + "<span class='played'>played</span>"
                    }
                    question = question + " '<span id='character'>" + character + "</span>' in '<span id='title'>" + title + "</span>'?</p>";
                    $('.question').html(question);
                    
                    answerHeight();
                });
                var mode = 'movie/' + idAltMovie + "/credits",
                    urlByIdAlt = tmdb + mode + key;
                $.getJSON(urlByIdAlt, function (json) { // Get alternative movie
                    var actorAlt = json.cast[0].name;
                    // Inset false answer
                    if (randomNumber === 1) {
                        $('.answer.right').html("<p>" + actorAlt + "</p>");
                    } else {
                        $('.answer.left').html("<p>" + actorAlt + "</p>");
                    }
                    $("div[data-slick-index='1'] > *").fadeIn();
                    return; 
                });
            }
        }
        randomMovie();
    });
}
// Question type: What actor - END

// Question type: What year
function whichMovie() {
    $("body").removeClass("whichActor").addClass("whichMovie");
    var mode = 'discover/movie?',
        page = '&page=1',
        currentYear = new Date().getFullYear(),
        year = Math.floor(Math.random() * (currentYear - (currentYear - 20) + 1) + (currentYear - 20)),
        query = "&primary_release_year=" + year + ".desc&sort_by=popularity.desc", 
        urlMovie = tmdb + mode + page + key + query;
    $.getJSON(urlMovie, function (json) {
        var randomNumber = Math.floor(Math.random() * (19 - 0 + 1)) + 0,
            title = json.results[randomNumber].title,
            range = 1,
            yearAlt = (Math.round(Math.random()) * 2 - 1);
        if (year === currentYear) {
            yearAlt = year - range;
        } else if (year > currentYear - 3) {
            yearAlt = year + yearAlt;
        } else if ((year < currentYear - 3) && (year > currentYear - 12)) {
            range = 2;
            yearAlt = year + (yearAlt * range);
        } else {
            range = 3;
            yearAlt = year + (yearAlt * range);
        }
        feedbackReset();
        // Inset question
        var question;
        question = "<p class='whichMovieparagraf'>When was '<span id='releaseTitle'>" + title + "</span>' released?</p>";
        $('.question').html(question);
        answerHeight();
        randomNumber = Math.round(Math.random());
        // Inset answers
        if (randomNumber === 0) {
            setAnswer("left", year);
            $('.answer.right').html("<p>" + yearAlt + "</p>");
        } else {
            setAnswer("right", year);
            $('.answer.left').html("<p>" + yearAlt + "</p>");
        }
        $("div[data-slick-index='1'] > *").fadeIn();
    });
}
// Question type: What year - END

// Score counter
var score = 0;
function scoreCounter() {
    score = score + 1;
    if (!tutorialMode) {
        changeTime(2);
    }
    $("#score").text(score);
}
// Score counter - END

// Save score to Local storage
function saveScore() {
    var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
    if (score > retrivedValue) {
        localStorage.setItem('LocalStorageKey', score);
        var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue); // Der skal vel ikke stå "var" i starten af denne linje?
        $("#popupscore").text("New highscore: " + retrivedValue + ".");
    } else {
        $("#popupscore").text("You got " + score + " pts. Your highscore is " + retrivedValue + ".");
    }
}
// Save score to Local storage - END

// Timer
function timer() {
    $("#DateCountdown").TimeCircles({
        "animation": "smooth",
        "bg_width": 1.2,
        "fg_width": 0.1,
        use_background: false,
        total_duration: 101,
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
                "color": "rgba(0, 0, 0, 0.4)",
                "show": true
            }

        }
    }).addListener(function (unit, amount, total) {
        if (total < 1) {
            $("#DateCountdown").TimeCircles().stop();
            startVibrate(100);
            saveScore();
            $(".overlay").fadeIn();
            $("body").addClass("blur");
            $("#closeOverlay").click(function () {
                resetGame();
            });
        }
    });
}
// Timer - END

// Reset game
function resetGame() {   
    questionType();
    $("#DateCountdown").data('timer', 100).TimeCircles().restart();
    $("body").removeClass("blur");
    $(".overlay").fadeOut();
    score = 0;
    $("#score").text(score);
    $("body").removeClass();
}
// Reset game - END

function changeTime(secs) {
    var timeLeft = $("#DateCountdown").TimeCircles().getTime(),
    newTime = timeLeft+secs;    
    if(newTime > 100){
        newTime = 100;
    }
    $("#DateCountdown").data('timer', (newTime)).TimeCircles().restart();
}

// Initiate slider
function initiateSlide() {
    if (!Modernizr.touch) {
        $('.slide-container').slick({
            initialSlide: 1,
            arrows: false,
            infinite: false,
            accessibility: false,
            swipe: false
        });
    
    }else{
        $('.slide-container').slick({
            initialSlide: 1,
            arrows: false,
            infinite: false,
            accessibility: false
        });
    }
    
    
    
}
// Initiate slider - END

// Set height of Slider
function setSlideHeight() {
    var windowHeight = $(window).height();
    $(".page").css("height", windowHeight + "px");
}
// Set height of Slider - END

// Return slider to question page
function resetSliderPage() {
    $('.slide-container').on('afterChange', function (event, slick, direction) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) {
            setTimeout(function () {
                $('.slide-container').slick("slickSetOption", "speed", "0");
                $('.slide-container').slick("slickGoTo", 1);
                $('.slide-container').slick("slickSetOption", "speed", "300");
            }, 100);
        }
    });
}
// Return slider to question page - END

// Hide question and answer options
// - and then fade them in
function hideQuestion() {    // 
    $("div[data-slick-index='1'] > *").hide(); // Den fader ind før vi er færdige med at hente data fra db, så den blinker nogle gange, især på dårligt net.
}
// Hide question and answer options - END

// Check answer
function answerChecker() {
    // Check on slide
    $('.slide-container').on('beforeChange', function (event, slick) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) { // only run if page is not the middle one, this is to prevent it from running twice, and to prevent it from running if you cancel a drag
            var correctAnswer = $("." + correctAnswerClass).closest();
            if ($(".answer." + correctAnswerClass).hasClass("left")) {
                correctAnswer = 0;
            } else if ($(".answer." + correctAnswerClass).hasClass("right")) {
                correctAnswer = 2;
            }

            if (currentSlide === correctAnswer) {
                scoreCounter();
                $("body").addClass("correctBg").removeClass("falseBg");
            } else {
                $("body").addClass("falseBg").removeClass("correctBg");
                changeTime(-4);
            }
            questionReset();
            if (!tutorialMode) {
                questionType();
            }
        }
    });
    $('.slide-container').on('afterChange', function (event, slick) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) {
            hideQuestion();
        }
    });
}
// Check answer - END

// Start game
function startGame() {
    $("body").addClass("gameStart");
    $(".intro, .guideOverlay").delay(200).fadeOut();
    timer();
}
// Start game - END

function startGuide() {
    tutorialMode = true;
    $(".intro").delay(200).fadeOut();
    timer();
    setTimeout(function() {
        $("#DateCountdown").TimeCircles().stop();
    },50);
    $(".guideOverlay").fadeIn();
    nextTip();
}

function tutorialEnd() {
    tutorialMode = false;
};

var tipNumber = 1;
function nextTip() {
    $(".guideOverlay__text").hide();
    $(".tips").css("opacity","0.1");
    $(".tip"+tipNumber+"").css("opacity","1").fadeIn();
    tipNumber = tipNumber+1;
    if (tipNumber > 5){
        $(".tips").css("opacity","1");
        $('.slide-container').slick("slickSetOption", "speed", "1500");
        var correctIndex = $(".page.correct").index(".page");
        $('.slide-container').slick("slickGoTo", correctIndex);
        $('.slide-container').slick("slickSetOption", "speed", "300");
    }
}

function touchCheck() {
    if (!Modernizr.touch) { 
        $(".no-touch .left").click(function(){
            $('.slide-container').slick("slickGoTo", 0);
        });
        $(".no-touch .right").click(function(){
            $('.slide-container').slick("slickGoTo", 2);
        });    
    } 
}

// Answer height
function answerHeight() {
    var questionHeight = $(".question").outerHeight();
    var windowHeight = $(window).height();
    var questionHeightRatio = questionHeight / windowHeight;
    var answerHeight = 1 - questionHeightRatio;
    $(".answers").css("height", answerHeight * 100 + "%");
}
// Answer height - END

// Click
function clickEvents() {
    $("#start").click(function () {
        startGame();
    });
    $("#guide").click(function () {
        startGuide();
    });
    $(".guideOverlay__text:not(.tip5)").click(function () {
        nextTip();
    });
    $(".guideOverlay__text.tip5").click(function () {
        tutorialEnd();
        resetGame();
        startGame();
    });
}
// Click - END

// Ready
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    resetSliderPage();
    questionType();
    answerChecker();
    clickEvents();
    touchCheck();
});

// Ready - END

// Scroll
$(window).scroll(function () {
});
// Scroll - END


// Resize
$(window).resize(function () {
    setSlideHeight();
    answerHeight();
});
// Resize - END

// Arrow keys
$(document).keyup(function (e) {
	if(e.which == 37) { // Left
        if (!tutorialMode) {
            $('.slide-container').slick("slickGoTo", 0);
        }
	}
	if(e.which == 39) { // Right
        if (!tutorialMode) {
            $('.slide-container').slick("slickGoTo", 2);
        }
	}
});
// Arrow keys - END