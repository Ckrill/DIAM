(function ($) {

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
            while(arr.length < 4){
              var randomnumber=Math.ceil(Math.random()*18)
              var found=false;
              for(var i=0;i<arr.length;i++){
                if(arr[i]==randomnumber){found=true;break}
              }
              if(!found)arr[arr.length]=randomnumber;
            }
            var idMovie = json.results[arr[0]].id,
            voteCount = json.results[arr[0]].vote_count,
            title = json.results[arr[0]].title,
            idAltMovie1 = json.results[arr[1]].id,
            idAltMovie2 = json.results[arr[2]].id;
            if(idAltMovie1==idMovie || idAltMovie2==idMovie){
                randomMovie();
            }
            if (voteCount < minimumVotes){
                randomMovie();
            }else{
                $('#title').text(title);                         
                var mode = 'movie/'+idMovie+"/credits",
                key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                urlById = tmdb+mode+key;
                $.getJSON(urlById, function (json) {
                    console.log(json);
                    var actor = json.cast[0].name,
                    character = json.cast[0].character;
                    $('#actor').text(actor);
                    $('#character').text(character);
                });
                var mode = 'movie/'+idAltMovie1+"/credits",
                key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                urlByIdAlt = tmdb+mode+key;
                $.getJSON(urlByIdAlt, function (json) {
                    console.log(json);
                    var actorAlt = json.cast[0].name;
                    $('#actorAlt').text(actorAlt);
                });
                var mode = 'movie/'+idAltMovie2+"/credits",
                key = '?api_key=83b296315507b7ea0ccdcc536a5ab745',
                urlByIdAlt2 = tmdb+mode+key;
                $.getJSON(urlByIdAlt2, function (json) {
                    console.log(json);
                    var actorAlt2 = json.cast[0].name;
                    $('#actorAlt2').text(actorAlt2);
                });
                /*LocalStorage
                var retrivedValue = localStorage.getItem('LocalStorageKey', retrivedValue);
                $("#history").text(retrivedValue);
                localStorage.setItem('LocalStorageKey', retrivedValue+ title);*/
            }
        }
        randomMovie();
    });

})(jQuery);