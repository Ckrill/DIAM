function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false
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



// Ready

$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    resetSliderPage();
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