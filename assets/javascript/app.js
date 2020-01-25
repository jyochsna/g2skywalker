/* JavaScript/jQuery for Project #1 */

$(document).ready(function () {

    // Initialize Firebase

    var firebaseConfig = {
        apiKey: "AIzaSyB9khk4lQ0jXPOoqgHRbc8kGs8FRBLCU0c",
        authDomain: "datenightplanner-db265.firebaseapp.com",
        databaseURL: "https://datenightplanner-db265.firebaseio.com",
        projectId: "datenightplanner-db265",
        storageBucket: "datenightplanner-db265.appspot.com",
        messagingSenderId: "363079175780",
        appId: "1:363079175780:web:8fbd5e9219a9e1b9019971"
    };

    firebase.initializeApp(firebaseConfig);

    // Global Variables
    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // Database Variables
    //-------------------------------------------

    var database = firebase.database();
    var queryDB = firebase.database().ref();

    var userID; // Generated by RandomNo
    var userRecordKey;  // Autogenerated by DB
    var userAdded; // Generated by Moment.js
    var dbUID; // from user
    var dbAdded; // from added
    var dbName; // from name
    var dbSource; // from source
    var dbPlace; // from place
    var dbLng; // from lng
    var dbLat; // from lat
    var dbDate; // from date
    var dbMonth; // from month
    var dbDay; // from day
    var dbYear; // from year


    // User Input Variables
    //-------------------------------------------

    var userName = "";
    var userDate = "";
    var placeSource = "";
    var userPlace = ""; // 01182020 - Zipcode only right now
    var needRestaurant;
    var needDessert;
    var needMovies;

    // Form Submission Variables
    var isFirstClick = true;
    var isValid = false;

    // Error Checking Variables

    var errName = false;
    var errDate = false;
    var errSource = false;
    var errPlace = false;
    var errOptions = false;
    var containsText = /\D/g;
    var containsNumbers = /\d/g;
    var zip_code = false;


    // Calculated from User Input
    //-------------------------------------------
    var dateDay = "";
    var dateMonth = "";
    var dateYear = "";
    var longitude;
    var latitude;

    // Results Variables or Pull from Database
    //-------------------------------------------
    var resultsWeather;
    var resultsRestaurants;
    var resultsDessertSpots;
    var resultsMovies;
    var resultsAttractions;

    // Application Logic
    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // Page Load
    //-------------------------------------------
    //-------------------------------------------

    $("#restauranttest").hide();
    $("#restaurant-table").hide(); 
    $("#desserttest").hide();
    $("#moviestest").hide();
    $("#sunrisetest").hide();
    $("#weathertest").hide();
    $("#forecasttest").hide();


    // On Submit
    //-------------------------------------------
    //-------------------------------------------
    // Tested and Signed Off - __/__/____ PLK
    // --------------IN PROGRESS (Pam) ------------------   


    // Store user input from FORM
    $("#submit").on("click", function (event) {

        // Prevents form action default 
        event.preventDefault();

        // Clear any error messages on the userInput form
        $("#invalid_name").text("");
        $("#invalid_date").text("");
        $("#invalid_source").text("");
        $("#invalid_place").text("");

        // Checks for first click of submit button

        if (isFirstClick === true) {

            // Set variable to false to prevent new record if user clicks submit again
            isFirstClick = false;

            // Generate random userKey
            userID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            console.log(userID);

            // Create database record for session with userKey

            userAdded = moment().format('lll');

            var newDater = {
                user: userID,
                added: userAdded,
                name: "",
                source: "",
                place: "",
                date: "",
                year: "",
                month: "",
                day: "",
                lng: "",
                lat: "",
                restaurants: "",
                desserts: "",
                movies: ""
            };

            // Push new record to database
            database.ref().push(newDater);

            // Query the database after child added for key value
            queryDB.orderByChild("user").equalTo(userID).on("child_added", function (snapshot) {

                // Set new record key to variable
                userRecordKey = snapshot.key;
                // console.log("Inside:");
                // console.log(snapshot.key);
                // console.log(userRecordKey);
                // console.log(snapshot.val());
            });

            // console.log("Outside:");
            // console.log(userRecordKey);

            // Call validateForm () function
            validateForm();

        } else {

            // Call validateForm () function
            validateForm();

        }

    });

    function validateForm() {

        // Form Validation

        // Set userName = Form userName
        // Test if null or equals 0, set or clear error message, and set error counter

        userName = $("#userName").val().toUpperCase();
        // console.log("--Contents of User Name--");
        // console.log(userName);

        if (userName === "" || userName === "0" || containsNumbers.test(userName)) {
            $("#invalid_name").html("Please enter your first name.");
            errName = true;
        } else {
            $("#invalid_name").html("");
            errName = false;
        }

        // console.log("---First Name and Error Status---");
        // console.log(userName);
        // console.log(errName);

        // Set userDate = Form userDate
        // Date is controlled by the calendar, no user input is allowed

        userDate = $("#userDate").val();

        // if (userDate === "" || userDate.length < 8 || containsText.test(userDate)) {
        if (userDate === "") {
            $("#invalid_date").html("Please enter a valid date.");
            errDate = true;
        } else {
            $("#invalid_date").html("");
            errDate = false;
            dateMonth = userDate.substr(0, 2);
            dateDay = userDate.substr(2, 2);
            dateYear = userDate.substr(4, 4);
        }

        // console.log("---Selected Date and Error Status---");
        // console.log(userDate);
        // console.log(errDate);
        // console.log("---Selected Month---");
        // console.log(dateMonth);
        // console.log("---Selected Day---");
        // console.log(dateDay);
        // console.log("---Selected Year---");
        // console.log(dateYear);

        // Set placeSource = Form source
        // Test if null

        placeSource = $("#source").val();

        if (placeSource === "") {
            $("#invalid_source").html("Please select a location type.");
            errSource = true;
        } else {
            $("#invalid_source").html("");
            errSource = false;
        }

        // Set userPlace = Form userPlace
        // Test if null

        userPlace = $("#userPlace").val();

        if (userPlace === "") {
            $("#invalid_place").html("Enter a location.");
            errPlace = true;
        } else {
            $("#invalid_place").html("");
            errPlace = false;
        }

        // Test for Valid Zip Code

        if (placeSource === "zip") {

            if (userPlace === "" || userPlace.length < 5 || userPlace.length > 5 || containsText.test(userPlace)) {
                $("#invalid_place").html("Please enter a zip code.");
                errPlace = true;
            } else {
                $("#invalid_place").html("");
                zip_code = true;
                errPlace = false;
            };
        }

        // console.log("---Date Location and Error Status---");
        // console.log(userPlace);
        // console.log(errPlace);

        // Test for Valid City and State
        //-------- In Progress --------

        if (placeSource === "city") {

            if (userPlace === "" || userPlace.indexOf(",") < 0 || containsNumbers.test(userPlace)) {
                $("#invalid_place").html("Please enter a city and state.");
                errPlace = true;
            } else {
                $("#invalid_place").html("");
                errPlace = false;
            };
        }

        // console.log("---Date Location and Error Status---");
        // console.log(userPlace);
        // console.log(errPlace);


        // Test for Valid Longitude and Latitude (from Map)
        //-------- In Progress --------

        if (placeSource === "map") {

            if (userPlace === "" || placeSource === "map" && userPlace === "" || (userPlace.indexOf(",") < 0)) {
                $("#invalid_place").html("Select a place from the map.");
                errPlace = true;
            } else {
                $("#invalid_place").html("");
                errPlace = false;
            };
        }

        // console.log("---Date Location and Error Status---");
        // console.log(userPlace);
        // console.log(errPlace);

        // Setting value of variable based on whether checkbox is checked
        if (document.getElementById("needRestaurant").checked === true) {
            needRestaurant = true;
        } else {
            needRestaurant = false;
        }

        // Setting value of variable based on whether checkbox is checked
        if (document.getElementById("needDessert").checked === true) {
            needDessert = true;
        } else {
            needDessert = false;
        }

        // Setting value of variable based on whether checkbox is checked
        if (document.getElementById("needMovies").checked === true) {
            needMovies = true;
        } else {
            needMovies = false;
        }

        // Check that at least one box is checked
        if (needRestaurant === false && needDessert === false && needMovies === false) {
            errOptions = true;
            $("#invalid_options").html("Please select at least one option.");
        } else {
            $("#invalid_options").html("");
            errOptions = false;
        }

        // console.log("---Need Restaurant---");
        // console.log(needRestaurant);
        // console.log("---Need Dessert---");
        // console.log(needDessert);
        // console.log("---Need Movies---");
        // console.log(needMovies);
        // console.log("---Need Attractions---");
        // console.log(needAttractions);
        // console.log("---At least 1 box checked---");
        // console.log(errOptions);

        if (errOptions === false && errName === false && errDate === false && errSource === false && errPlace === false) {
            isValid = true;
            updateDatabase();
        } else {
            isValid = false;
        }

    }

    //Update database based on Record Key and Call App Functions


    async function updateDatabase() {

        // Get longitude and latitude from userPlace

        var convAPIkey = "c833b0a3e4104de495176d7252219568";
        var convQueryURL = "https://api.opencagedata.com/geocode/v1/json?countrycode=us&q=" + userPlace + "&key=" + convAPIkey + "&language=en&pretty=1"

        await $.ajax({
            type: "GET",
            url: convQueryURL,
            datatype: "json",
            success: function (response) {
                latitude = response.results[0].geometry.lat;
                longitude = response.results[0].geometry.lng;
                console.log("Internal to Function: " + latitude + " , " + longitude);
            }
        });

        // Console log longitude and latitude
        // console.log("External to Function: " + latitude + " , " + longitude);

        // Update record in database based on Record Key

        var recordRef = database.ref(userRecordKey);

        recordRef.update({
            "name": userName,
            "source": placeSource,
            "place": userPlace,
            "date": userDate,
            "year": dateYear,
            "month": dateMonth,
            "day": dateDay,
            "lng": longitude,
            "lat": latitude,
            "restaurants": needRestaurant,
            "desserts": needDessert,
            "movies": needMovies
        });

        // Add User's Name to DOM
        $("#msg").empty();
        $("#msg").append(userName + " your results are below...");


        // Call other APIs

        sunset();
        weather();
        forecast();
        updateMovies(needMovies);
        restaurantUpdate(needRestaurant);
        dessertsUpdate(needDessert);
    }

    // Get Results Data
    //-------------------------------------------
    //-------------------------------------------

    // Sunset, Weather, and Forecast API Data
    //-------------------------------------------
    // --------------TO DO------------------   
    // Pull and store data
    // Cycle through the optional checkboxes (restaurants, dessert, movies, attractions)
    // Call the appropriate function


    function sunset() {

        //var sunQueryURL = "https://api.sunrise-sunset.org/json?lat=" + latitude + "&lng=" + longitude; 
        $("#sunrisetest").show();

        $.ajax({
            url: "https://api.sunrise-sunset.org/json?lat=" + latitude + "&lng=" + longitude,
            method: "GET",
        })

            .then(function (response) {

                var sunrise = response.results.sunrise;
                var sunset = response.results.sunset;

                var hrs = -(new Date().getTimezoneOffset() / 60);

                console.log(moment(sunset, 'HH:mm A').add(hrs, 'hours').format("HH:mm A"))
                var sunsetLocal = moment(sunset, 'HH:mm A').add(hrs, 'hours').format("HH:mm A");

                console.log(moment(sunrise, 'HH:mm A').add(hrs, 'hours').format("HH:mm A"))
                var sunriseLocal = moment(sunrise, 'HH:mm A').add(hrs, 'hours').format("HH:mm A");

                $("#resultsSunrise").empty();
                $("#resultsSunrise").html("<br>Sunrise: " + sunriseLocal + "<br> Sunset: " + sunsetLocal);


            });

    }

    function weather() {
        $("#weathertest").show();


        var weatherAPIKey = "166a433c57516f51dfab1f7edaed8413";

        var weatherQueryURL = "";

        if (zip_code) {

            weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + userPlace + "&appid=" + weatherAPIKey;

        } else {

            weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherAPIKey;

        }

        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        })

            .then(function (response) {

                // Log the resulting object

                console.log(response);

                var windy = "";
                var cloudy = "";

                if (response.wind.speed < 11) {
                    windy = "Light breeze";
                }

                if (response.wind.speed > 10 && response.wind.speed < 39) {
                    windy = "Moderate wind";
                }

                if (response.wind.speed > 38 && response.wind.speed < 62) {
                    windy = "Strong wind";
                }

                if (response.wind.speed > 61 && response.wind.speed < 103) {
                    windy = "Very strong wind";
                }

                if (response.wind.speed > 102) {
                    windy = "Hurricane";
                }

                if (response.clouds.all < 11) {
                    cloudy = "Sunny";
                }
                if (response.clouds.all > 10 && response.clouds.all < 26) {
                    cloudy = "Slightly cloudy";
                }

                if (response.clouds.all > 25 && response.clouds.all < 51) {
                    cloudy = "Partly cloudy";
                }

                if (response.clouds.all > 52 && response.clouds.all < 76) {
                    cloudy = "Very cloudy";
                }

                if (response.clouds.all > 75) {
                    cloudy = "Overcast";
                }

                // Transfer content to HTML for current weather information 
                var temp = (response.main.temp - 273.15) * 1.80 + 32;
                var highTemp = (response.main.temp_max - 273.15) * 1.80 + 32;
                var lowTemp = (response.main.temp_min - 273.15) * 1.80 + 32;

                $("#resultsWeather").empty();
                $("#resultsWeather").html("<br>Current Temperature: " + temp.toFixed(1) + " | High: " + highTemp.toFixed(1) + " | Low: " + lowTemp.toFixed(1) + " | " + cloudy + " | " + windy + "<br>");

            });

    }

    function forecast() {
        $("#forecasttest").show();
        var forecastAPIKey = "166a433c57516f51dfab1f7edaed8413";

        var forecastQueryURL = "";

        if (zip_code) {

            forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + userPlace + "&appid=" + forecastAPIKey;

        } else {

            forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + forecastAPIKey;

        }
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        })

            .then(function (response) {
                $("#resultsForecast").empty();

                var hours = [7, 15, 23, 31, 39];
                var days = [1, 2, 3, 4, 5];

                var windy = "";
                var cloudy = "";

                function wind(i) {
                    if (response.list[i].wind.speed < 11) {
                        windy = "Light breeze";
                    }

                    if (response.list[i].wind.speed > 10 && response.list[i].wind.speed < 39) {
                        windy = "Moderate wind";
                    }

                    if (response.list[i].wind.speed > 38 && response.list[i].wind.speed < 62) {
                        windy = "Strong wind";
                    }

                    if (response.list[i].wind.speed > 61 && response.list[i].wind.speed < 103) {
                        windy = "Very strong wind";
                    }

                    if (response.list[i].wind.speed > 102) {
                        windy = "Hurricane";
                    }

                }

                function cloud(i) {
                    if (response.list[i].clouds.all < 11) {
                        cloudy = "Sunny";
                    }
                    if (response.list[i].clouds.all > 10 && response.list[i].clouds.all < 26) {
                        cloudy = "Slightly cloudy";
                    }

                    if (response.list[i].clouds.all > 25 && response.list[i].clouds.all < 51) {
                        cloudy = "Partly cloudy";
                    }

                    if (response.list[i].clouds.all > 52 && response.list[i].clouds.all < 76) {
                        cloudy = "Very cloudy";
                    }

                    if (response.list[i].clouds.all > 75) {
                        cloudy = "Overcast";
                    }

                }

                for (i = 0; i < hours.length; i++) {
                    var temp = (response.list[hours[i]].main.temp - 273.15) * 1.80 + 32;
                    wind(hours[i]);
                    cloud(hours[i])

                    $("#resultsForecast").append("Day " + (i + 1) + ": Avg. Temp.: " + temp.toFixed(1) + " | " + windy + " | " + cloudy + "<br>");
                }

            });
    }


    // Restaurants API Data
    //-------------------------------------------
    // --------------TO DO------------------   

    // Pull and store data 
    // Cycle through the remaining optional checkboxes (dessert, movies, attractions)
    // Call the appropriate function
    // If none checked, call the Return Results function



    function restaurantUpdate(needRestaurant) {
        if (needRestaurant) {
            $("#restauranttest").show();
            $("#restaurant-table").show(); 
            var apiKey = " d0782c26de92e778b76dcefa06a8ea95";
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/search?" + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET",
                headers: { "user-key": apiKey },
            }).then(function (response) {
                console.log("-----restUpdate----");
                console.log(response);
                var results = response;


                for (let i = 0; i < results.restaurants.length; i++) {

                    var name = results.restaurants[i].restaurant.name;
                    var details = results.restaurants[i].restaurant.url;
                    var aTag = $("<a>")
                    aTag.attr("target", "_blank")
                    aTag.attr("class", "restLink")
                    aTag.attr("href", details).text(details);
                    var cuisines = results.restaurants[i].restaurant.cuisines;
                    var newRow = $("<tr>").append(
                        $("<td>").text(name),
                        $("<td>").text(cuisines),
                        $("<td>").append(aTag)

                    );
                    $("#restaurant-table > tbody").append(newRow);
                }

            })
        }
    }

    // Dessert Spots API Data
    //-------------------------------------------
    // --------------TO DO------------------  
    function dessertsUpdate(needDessert) {
        if (needDessert) {
            $("#desserttest").show();
            var apiKey = " d0782c26de92e778b76dcefa06a8ea95";
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/search?q=desserts" + "&lat=" + latitude + "&lon=" + longitude,

                method: "GET",
                headers: { "user-key": apiKey },

            }).then(function (response) {

                console.log(response);
                var results = response;
                console.log(results);
                console.log("------Test----");
                console.log(results.restaurants[0].restaurant.name);
                for (let i = 0; i < results.restaurants.length; i++) {
                    //     console.log("###titleonly####");
                    //    console.log(results.restaurants[i].restaurant.name);
                    //    console.log(results.restaurants[i].restaurant.location);
                    //    console.log(results.restaurants[i].restaurant.highlights);
                    var name = results.restaurants[i].restaurant.name;
                    var location = results.restaurants[i].restaurant.location.address;
                    var timings = results.restaurants[i].restaurant.timings;

                    var newRow = $("<tr>").append(
                        $("<td>").text(name),
                        $("<td>").text(location),
                        $("<td>").text(timings)

                    );
                    $("#desserts-table > tbody").append(newRow);
                    // //    console.log("!!!!!!LOCATION!!!!");
                    // //    console.log(results.restaurants[i].restaurant.location);
                }

            })
        }
    }

    // Movies API Data
    //-------------------------------------------
    // --------------TO DO------------------   
    // Pull and store data 
    // Check if Attractions was checked, if so call Attractions function
    // If not, call the Return Results function

    function updateMovies(needMovies) {
        if (needMovies) {
            $("#moviestest").show();
            var apiKey = "wgkpzjdk25tfwrybxqvrtv2p";
            var queryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + dateYear + "-" + dateMonth + "-" + dateDay + "&zip=" + userPlace + "&api_key=" + apiKey;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // console.log(queryURL);
                console.log(response);
                var resultsMovies = response;
                $("#movie-table > tbody").empty();
                for (let i = 0; i < resultsMovies.length; i++) {
                    // console.log(resultsMovies[i]);
                    var title = resultsMovies[i].title;
                    var details = resultsMovies[i].officialUrl;
                    var aTag = $("<a>").attr("href", details).text(details);
                    // console.log(resultsMovies[i].showtimes);
                    for (let j = 0; j < resultsMovies[i].showtimes.length; j++) {
                        //     console.log("----showtimes----");
                        var showTimes = resultsMovies[i].showtimes[j].theatre.name;
                    }
                    var newRow = $("<tr>").append(
                        $("<td>").text(title),
                        $("<td>").append(aTag),
                        $("<td>").text(showTimes)
                    );
                    $("#movie-table > tbody").append(newRow);

                }


            });
        }
    }

    // Day in History API Data
    //-------------------------------------------
    // Tested and Signed Off - 01/24/2020 PLK
    //-------------------------------------------

    // AJAX Call when 'Date In History' button clicked

    $("#history").on("click", function (event) {

        // Prevent default action on click
        event.preventDefault();

        // Set error message
        $("#resultsHistory").html("Please submit the form above with a valid date.");


        // Pull data from database

        // Query record in database

        var queryDB = firebase.database().ref();

        queryDB.orderByChild("user").equalTo(userID).on("value", function (snapshot) {

            // Before DB Call
            // console.log("Pre-call Record Key and Date");
            // console.log(userRecordKey);
            // console.log(userDate);

            snapshot.forEach(function (snapshot) {

                // console.log("Post-call Record Key , Month, Day, and Date");
                // console.log(snapshot.key);
                // console.log(snapshot.child("date").val());
                // console.log(snapshot.child("month").val());
                // console.log(snapshot.child("day").val());

                dateMonth = snapshot.child("month").val();
                dateDay = snapshot.child("day").val();
            });
            // console.log("Outside call Month and Day");
            // console.log(dateMonth);
            // console.log(dateDay);

            // AJAX Call with settings when Date Day in History Button Clicked
            $.ajax({
                url: "https://byabbe.se/on-this-day/" + dateMonth.replace(/^0+/, '') + "/" + dateDay.replace(/^0+/, '') + "/events.json",
                data: {
                    format: 'json'
                },

                // Error handling
                error: function () {
                    $("#resultsHistory").html("Please submit the form above with a valid date.");
                },

                // On success, display results in History modal
                success: function (response) {
                    $("#resultsHistory").empty();
                    console.log(response);

                    for (let i = 0; i < response.events.length; i++) {

                        $("#resultsHistory").append("<p>" + response.events[i].year + ": " + response.events[i].description + "</p>");
                    }
                },
                type: 'GET'
            });

        });



        // console.log("Outside call Month and Day");
        // console.log(dateMonth);
        // console.log(dateDay);




        // Help Data - return in modal
        //-------------------------------------------
        //-------------------------------------------


        // Joke of the Day API Data
        //-------------------------------------------
        // Tested and Signed Off - 01/24/2020 PLK
        //-------------------------------------------

        // AJAX Call with settings when 'Joke of the Day' button clicked

        $("#jokes").on("click", function (event) {

            // Prevent default action on click
            event.preventDefault();

            // Query the data from the API
            //-----Pulls the joke for the current day-------------

            $.ajax({
                url: "https://api.jokes.one/jod?category=jod",
                data: {
                    format: 'json'
                },
                // Error handling
                error: function () {
                    $("#resultsJokes").html("An error occurred, please try again.");
                },
                // On success, display results in Jokes modal
                success: function (response) {
                    $("#resultsJoke").html(response.contents.jokes[0].joke.text);
                },
                type: 'GET'
            });

        });

        // Quote of the Day API Data
        //-------------------------------------------
        // Tested and Signed Off - 01/24/2020 PLK
        //-------------------------------------------

        // AJAX Call with settings when 'Quote of the Day' button clicked

        $("#quotes").on("click", function (event) {

            // Prevent default action on click
            event.preventDefault();

            // Query the data from the API
            //-----Pulls the quote for the current day-------------

            $.ajax({
                url: "http://quotes.rest/qod.json",
                data: {
                    format: 'json'
                },
                // Error handling
                error: function () {
                    $("#resultsQuotes").html("An error occurred, please try again.");
                },
                // On success, display results in Quotes modal
                success: function (response) {
                    $("#resultsQuotes").html(response.contents.quotes[0].quote);
                },
                type: 'GET'
            });

        });

    });


    $("#exit").click(function () {

        // Delete record in database
        console.log(userRecordKey);

        if (userID !== "") {

            var deleteRef = database.ref(userRecordKey);

            function delAssets() {
                deleteRef.set({});
                console.log("Deleted: " + userRecordKey);
            };

            delAssets();

            window.open("goodbye.html", '_self');

        } else {
            window.open("goodbye.html", '_self');
        }

    })




    // Movie Reviews API Data
    //-------------------------------------------
    // Tested and Signed Off - __/__/2020 INITIALS
    //-------------------------------------------

    // --------------IN PROGRESS (Jyochsna) -----
    //----zipcode need to be retrieved from UI------

    // AJAX Call with settings when 'Movie Reviews' button clicked


    // Book Reviews API Data
    //-------------------------------------------
    // Tested and Signed Off - __/__/2020 INITIALS
    //-------------------------------------------

    // --------------TO DO------------------

    $("#books").on("click", function (event) {
        var queryURL = "https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=SVk93difMBPzCqu40AH1AV6vLslWr9hz";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log("!!!!!!");
            console.log(response);

            for (let i = 0; i < response.results.length; i++) {
                // console.log("-----ABCD----")
                // console.log(response.results[i].url)
                var review = response.results[i].url;
                var aTag = $("<a>")
                aTag.attr("target", "_blank")
                aTag.attr("class", "books-review")
                aTag.attr("href", review).text(review);
                $("#resultsBooks").html(aTag);
            }

        })

    })

    // Return Results Data to DOM/Email
    //-------------------------------------------
    //-------------------------------------------

    // Function to Write to DOM
    //-------------------------------------------
    // Tested and Signed Off - __/__/2020 INITIALS
    //-------------------------------------------

    // Show ONLY headers for results that were requested
    // --------------TO DO------------------   



    // Function to Email?
    //-------------------------------------------
    // Tested and Signed Off - __/__/2020 INITIALS
    //-------------------------------------------

    // If so, need user's email address
    // --------------TO DO------------------     



});
