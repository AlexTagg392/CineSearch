
// This .on("click") function will trigger the AJAX Call
$("#find-movie").on("click", function (event) {
    // Preventing the submit button from trying to submit the form
    event.preventDefault();

    // Get input to complete URLs
    var movie = $("#movie-input").val();
    console.log(movie);
    var actor = $("#movie-search").val();
    console.log(actor);
     var genre = $("#movie-genre").val();
                var genreText = genre.toUpperCase();

    // OMDB
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

    //TMDB
    var queryURL2 = "https://api.themoviedb.org/3/search/person?api_key=cff64710d5348e4098a7bfe41fde7e0a&language=en-US&query=" + actor + "&page=1&include_adult=false";
    //console.log(queryURL2);


    //Movie Calls if there is input
    if (movie != "") {
        //==============================================================================================
        //Utelly Call
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movie + "&country=us",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
                "x-rapidapi-key": "aa91224253mshcffb6f28e273145p1cda2bjsnd88f51e697f7"
            }

        };

        $.ajax(settings).done(function (responseUT) {
            //console.log(responseUT);
            console.log(responseUT.results[0]);
            var servs = responseUT.results[0].locations;
            console.log(servs.length);
            console.log(servs[0].display_name);
            for (i = 0; i < servs.length; i++) {
                console.log(servs[i].display_name);
            };
        });

        //OMDB Call
        //==============================================================================================
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log("This is the rating " + response.Rated);
            console.log("This is the year of release " + response.Year);
            //Only get Rotten Tomatoes score if it is there
            if (response.Ratings.length >= 2) {
                console.log("Rotten Tomatoes Score is " + response.Ratings[1].Value);
            };

            $("#movie-view").text(response.Plot);
            $("#rating-view").text("This is the MPAA rating: " + response.Rated);
            $("#year-view").text("This is the year of release: " + response.Year);
            $("#rotten-view").text("Rotten Tomatoes Score is " + response.Ratings[1].Value);
            //$("#").text(response.Year);


            var thumb = $("<div>");
            var posterImage = $("<img>");
            posterImage.attr("src", response.Poster);
            $(thumb).append(posterImage);
            $("#movie-view").append(thumb);
            var title = response.Title;
            var titleEl = $("<h1>");
            titleEl.css("font-style", "bold");
            titleEl.text(title);
            console.log(title);

            $("#movie-view").prepend(titleEl);
            //$("#movie-view").before(" - Rated: " + response.Rated) + "<br>";

            //document.getElementById("movie-view").reset();

        });
    } else {
        console.log("EMPTY MOVIE!!!");
    };
    //Actor Call if there is input
    //TMDB
    //==================================================================
    if (actor != "") {
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (responseAct) {
            //console.log(responseAct);
            //console.log(responseAct.results[0].id);
            // =================================================================
            //Second Call to TMDB
            var personId = responseAct.results[0].id;
            //console.log(personId);
            var queryURLP = "https://api.themoviedb.org/3/person/" + personId + "/combined_credits?api_key=cff64710d5348e4098a7bfe41fde7e0a&language=en-US";
            //console.log(queryURLP);
            $.ajax({
                url: queryURLP,
                method: "GET"
            }).then(function (response2) {
                //    console.log(response2);
                var nums = parseInt($("#movie-number").val());
                for (i = 0; i < nums; i++) {
                    //console.log(nums);
                    console.log(response2.cast[i].character + "   " + response2.cast[i].original_title);
                    $("#actor-view").append(response2.cast[i].character + " - " + response2.cast[i].original_title + "<hr>");
                }

            });
        });
    } else {
        console.log("EMPTY ACTOR!!!");
    };


//For a genre search
//TMDB
if (genre != "") {
    $.ajax({
        url: "https://api.themoviedb.org/3/genre/movie/list?api_key=cff64710d5348e4098a7bfe41fde7e0a&language=en-US",
        method: "GET"
    }).then(function (response) {
        for (i = 0; i < response.genres.length; i++) {
            //console.log(response);
            //console.log(genre);
            //console.log(response.genres[i].name);
            var gText = response.genres[i].name
            var gUp = gText.toUpperCase();
            var gCode = response.genres[i].id

            
            //console.log(gUp);
            //console.log(genreText);
            //console.log(gCode);

            if (genreText === gUp) {
                console.log(gCode);
                gSearch = gCode;
                console.log(gSearch);
            }
        }

        console.log(gSearch);
        //------------WORKING---------------------------------------
        $.ajax({
            url: "https://api.themoviedb.org/3/discover/movie?api_key=cff64710d5348e4098a7bfe41fde7e0a&language=en-US&page=1&with_genres=" + gSearch,
            method: "GET"
        }).then(function (responseGenre) {
            console.log(responseGenre);
            for (i = 0; i < responseGenre.results.length; i++) {
                console.log(responseGenre.results[i].title);
                movie = responseGenre.results[0].title;
                $("#genre-view").append(responseGenre.results[i].title + "<hr>");
            }
        });
        //----------------------WORKING--------------------------------
    });
};

console.log("No Genre Search");



$("#reset").on("click", function () {
    $("#movie-input").val("");
    $("#movie-search").val("");
    $("#movie-number").val("");
    $("#movie-genre").val("");
    $("#movie-year").val("");
    $("#movie-view").empty();
});



});
