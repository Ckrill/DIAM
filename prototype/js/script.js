/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

// Options
var correctAnswerClass = "correct",
    falseAnswerClass = "false",

// json variables
    tmdb = 'http://api.themoviedb.org/3/',
    key = '&api_key=83b296315507b7ea0ccdcc536a5ab745',
    flag = 0;
function questionType() {
    flag = flag + 1;
    if (flag > 3) {
        flag = 0;
        whichMovie();
    } else {
        whichActor();
    }
}
function startVibrate(level) {
    navigator.vibrate(level);
}

function feedbackReset() {
    $('.slide-container .feedback, .answer').removeClass(correctAnswerClass);
    $('.slide-container .feedback').removeClass(falseAnswerClass);
}
function setAnswer(correctAnswer, actor) {
    var falseAnswer;
    if (correctAnswer === "left") {
        falseAnswer = "right";
    } else {
        falseAnswer = "left";
    }
    $('.answer.' + correctAnswer).addClass(correctAnswerClass);
    $('.answer.' + correctAnswer + ' p').text(actor);
    $('.slide-container .feedback.' + correctAnswer).addClass(correctAnswerClass);
    $('.slide-container .feedback.' + falseAnswer).addClass(falseAnswerClass);
//    console.log("Correct is " + correctAnswer);
}

function whichActor() {
    $("body").removeClass("whichMovie");
    var mode = 'movie/top_rated?',
        TopMovieRange = 1000, // Top 1000?
        minimumVotes = 200,  // Minimum 150 votes (Det tager lidt tid før nyere film kommer derop.)
        page = "&page=" + Math.floor((Math.random() * (TopMovieRange / 20)) + 1), // Dataen er delt op i "sider" (json filer), med 20 film i hver.
        url = tmdb + mode + page + key;
    $.getJSON(url, function (json) {
//        console.log(json);
        function randomMovie() {
            var voteCount = json.results[[0]].vote_count, // Chris: Jeg satte "var" ind i starten af denne linje, var det ikke rigtigt at det manglede?
                title = json.results[[0]].title,
                arr = [];
            while (arr.length < 2) {
                var randomNumber = Math.ceil(Math.random() * 19), // hmmm
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
                voteCount = json.results[arr[0]].vote_count, // Chris: Den er allerede defineret, skal den bare opdateres eller fjernes?
                title = json.results[arr[0]].title, // Chris: Den er allerede defineret, skal den bare opdateres eller fjernes?
                idAltMovie = json.results[arr[1]].id;

            if (voteCount < minimumVotes) {
                randomMovie();
                return;
            } else {
                var randomNumber = Math.round(Math.random());
                $('#title').text(title);
                var mode = 'movie/' + idMovie + "/credits",
                    key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                    urlById = tmdb + mode + key;
                $.getJSON(urlById, function (json) { // Get movie
//                    console.log(json);
                    var actor = json.cast[0].name,
                        character = json.cast[0].character;
                    feedbackReset();
                    if (randomNumber === 0) {
                        setAnswer("right", actor);
                    } else {
                        setAnswer("left", actor);
                    }
                    if (character.indexOf("(voice)") >= 0) {
                        $("body").addClass("voice");
                        var character = character.replace(" (voice)", "");
                    } else {
                        $("body").removeClass("voice");
                    }
                    $('#character').text(character);
                });
                var mode = 'movie/' + idAltMovie + "/credits",
                    urlByIdAlt = tmdb + mode + key;
                $.getJSON(urlByIdAlt, function (json) { // Get alternative movie
//                    console.log(json);
                    var actorAlt = json.cast[0].name;
                    if (randomNumber === 1) {
                        $('.answer.right p').text(actorAlt);
                    } else {
                        $('.answer.left p').text(actorAlt);
                    }
                    return; // Chris: Hvorfor er der et "return" i denne funktion og ikke i den ovenover?
                });
            }
        }
        randomMovie();
    });
}

function whichMovie() {
    $("body").removeClass("whichActor").addClass("whichMovie");
    var mode = 'discover/movie?',
        page = '&page=1',
        currentYear = new Date().getFullYear(),
        year = Math.floor(Math.random() * (currentYear - (currentYear - 20) + 1) + (currentYear - 20)),
        query = "&primary_release_year=" + year + ".desc&sort_by=popularity.desc", // Dataen er delt op i "sider" (json filer), med 20 film i hver.    
        urlMovie = tmdb + mode + page + key + query;
    $.getJSON(urlMovie, function (json) {
//        console.log(json);
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
        if (randomNumber === 0) {
            $('.answer.right p').text(yearAlt);
            $('.answer.left p').text(year);
            $('.answer.left').addClass(correctAnswerClass);
        } else {
            $('.answer.left p').text(yearAlt);
            $('.answer.right p').text(year);
            $('.answer.right').addClass(correctAnswerClass);
        }
        $('#releaseTitle').text(title);
    });
}

var score = 0;
function scoreCounter() {
    score = score + 1;
    $("#score").text(score);
}

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
    $(".page").css("height", windowHeight + "px");
}
// Set height of Slider - END

// Return slider to question page
function resetSliderPage() {
    $('.slide-container').on('afterChange', function (event, slick, direction) {
//        console.log("Direction: " + direction);
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) {
            setTimeout(function () {
                $('.slide-container').slick("slickSetOption", "speed", "0");
                $('.slide-container').slick("slickGoTo", 1);
                $('.slide-container').slick("slickSetOption", "speed", "300");
//                console.log("Going back to the middle slide!");
            }, 100);
        }
    });
}
// Return slider to question page - END

function timer() {
    $("#DateCountdown").TimeCircles({
        "animation": "smooth",
        "bg_width": 1.2,
        "fg_width": 0.1,
        count_past_zero: false,
        use_background: false,
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
    }).addListener(function (unit, amount, total) {
        if (total === 0) {
            startVibrate(50);
            saveScore();
            $(".overlay").fadeIn();
            $("body").addClass("blur");
            $("#closeOverlay").click(function () {
                resetGame();
            });
        }
    });
}
function resetGame() {    // 
    questionType();
    $("#DateCountdown").TimeCircles().restart();
    $("body").removeClass("blur");
    $(".overlay").fadeOut();
    score = 0;
    $("#score").text(score);
}

function hideQuestion() {    // 
    $("div[data-slick-index='1'] > *").hide().fadeIn(); // Den fader ind før vi er færdige med at hente data fra db, så den blinker nogle gange, især på dårligt net.
}
function answerChecker() {
    // Check on slide
    $('.slide-container').on('swipe', function (event, slick) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) { // only run if page is not the middle one, this is to prevent it from running twice, and to prevent it from running you cancel a drag
            var correctAnswer = $("." + correctAnswerClass).closest();
            if ($("." + correctAnswerClass).hasClass("left")) {
                correctAnswer = 0;
//                console.log(correctAnswer);
            } else if ($("." + correctAnswerClass).hasClass("right")) {
                correctAnswer = 2;
//                console.log(correctAnswer);
            }

            if (currentSlide === correctAnswer) {
                scoreCounter();
                $("body").addClass("correctBg").removeClass("falseBg");
            } else {
                $("body").addClass("falseBg").removeClass("correctBg");
            }
            questionType();
        }
    });
    $('.slide-container').on('afterChange', function (event, slick) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 1) {
            hideQuestion();
        }
    });
}
function startGame(){
    $(".intro").fadeOut();
    timer();
}
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    resetSliderPage();
    questionType();
    
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