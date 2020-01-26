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

    // Database Variables
    //-------------------------------------------

    var database = firebase.database();
    var queryDB = firebase.database().ref();

    var userID; // Generated by RandomNo
    var userRecordKey;  // Autogenerated by DB
    var userAdded; // Generated by Moment.js


    // User Input Variables
    //-------------------------------------------

    var userName = "";
    var userDate = "";
    var placeSource = "";
    var userPlace = "";
    var needRestaurant;
    var needDessert;
    var needMovies;

    // Form Submission Variables
    //-------------------------------------------

    var isFirstClick = true;
    var isValid = false;

    // Error Checking Variables
    //-------------------------------------------

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

    // Other Variables

    //-------------------------------------------
    var welcomeMsg = "<p class='h4 text-dark'>Need help planning a special date that your partner will never forget?</p><p class='h4 text-primary'>Let us help you create your very own!</p>";
    var arrQuestions = [];


    // Application Logic
    //-------------------------------------------
    //-------------------------------------------

    // Page Load
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

    $("#message").html(welcomeMsg);
    $("#accordion").hide();
    $("#restaurantvis").hide();
    $("#restaurant-table").hide();
    $("#dessertvis").hide();
    $("#moviesvis").hide();
    $("#sunrisevis").hide();
    $("#weathervis").hide();
    $("#forecastvis").hide();


    // Store user input from FORM on Submit
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

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

            // Console log userID
            // console.log("----User ID----");
            // console.log(userID);

            // Assign date/time added to a variable
            userAdded = moment().format('lll');

            // Create database record for session with userKey
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
                // console.log("Inside function check-----");
                // console.log(snapshot.key);
                // console.log(userRecordKey);
                // console.log(snapshot.val());
            });

            // console.log("---Outside function check----");
            // console.log(userRecordKey);

            // Call validateForm () function
            validateForm();

        } else {

            // Hide the Accordion in the DOM and append message for user
            $("#message").html(welcomeMsg);
            $("#accordion").hide();
            $("#restaurantvis").hide();
            $("#restaurant-table").hide();
            $("#dessertvis").hide();
            $("#moviesvis").hide();
            $("#sunrisevis").hide();
            $("#weathervis").hide();
            $("#forecastvis").hide();

            // Call validateForm () function
            validateForm();

        }

    });

    // Form Validation function ()
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

    function validateForm() {

        // Set userName = Form userName
        userName = $("#userName").val().toUpperCase();
        // console.log("--Contents of User Name--");
        // console.log(userName);

        // Test if null or equals 0, set or clear error message, and set error counter
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

        //  Test if null
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


        // Set userPlace = Form userPlace

        userPlace = $("#userPlace").val();

        // Test if null

        if (userPlace === "") {
            $("#invalid_place").html("Enter a location.");
            errPlace = true;
        } else {
            $("#invalid_place").html("");
            errPlace = false;
        }

        // Set placeSource = Form source

        placeSource = $("#source").val();

        // Test if null

        if (placeSource === "") {
            $("#invalid_source").html("Please select a location type.");
            errSource = true;
        } else {
            $("#invalid_source").html("");
            errSource = false;
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

        // Set value of variable based on whether checkbox is checked
        if (document.getElementById("needRestaurant").checked === true) {
            needRestaurant = true;
        } else {
            needRestaurant = false;
        }

        // Set value of variable based on whether checkbox is checked
        if (document.getElementById("needDessert").checked === true) {
            needDessert = true;
        } else {
            needDessert = false;
        }

        // Set value of variable based on whether checkbox is checked
        if (document.getElementById("needMovies").checked === true) {
            needMovies = true;
        } else {
            needMovies = false;
        }

        // Check whether at least one box is checked
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
        // console.log("---At least 1 box checked---");
        // console.log(errOptions);

        if (errOptions === false && errName === false && errDate === false && errSource === false && errPlace === false) {
            isValid = true;
            updateDatabase();
        } else {
            isValid = false;
        }

    }

    // Update user's database record based on Record Key
    // Call App Functions

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

    // Sunset () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 SB
    //-------------------------------------------

    function sunset() {

        // Show Results Accordion
        $("#accordion").show();
        $("#sunrisevis").show();

        // Call API

        $.ajax({
            url: "https://api.sunrise-sunset.org/json?lat=" + latitude + "&lng=" + longitude,
            method: "GET",
        })

            .then(function (response) {

                var sunrise = response.results.sunrise;
                var sunset = response.results.sunset;

                var hrs = -(new Date().getTimezoneOffset() / 60);

                // console.log(moment(sunset, 'HH:mm A').add(hrs, 'hours').format("HH:mm A"))
                var sunsetLocal = moment(sunset, 'HH:mm A').add(hrs, 'hours').format("HH:mm A");

                // console.log(moment(sunrise, 'HH:mm A').add(hrs, 'hours').format("HH:mm A"))
                var sunriseLocal = moment(sunrise, 'HH:mm A').add(hrs, 'hours').format("HH:mm A");

                // Write results to the DOM in the results accordion
                $("#resultsSunrise").empty();
                $("#resultsSunrise").html("<br>Sunrise: " + sunriseLocal + "<br> Sunset: " + sunsetLocal);

            });

    }

    // Weather () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 SB
    //-------------------------------------------

    function weather() {

        // Show Results Accordion
        $("#weathervis").show();

        // Call API
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
                // console.log(response);

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

                // Write results to the DOM in the results accordion
                $("#resultsWeather").empty();
                $("#resultsWeather").html("<br>Current Temperature: " + temp.toFixed(1) + " | High: " + highTemp.toFixed(1) + " | Low: " + lowTemp.toFixed(1) + " | " + cloudy + " | " + windy + "<br>");

            });

    }

    // Forecast () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 SB
    //-------------------------------------------

    function forecast() {

        // Show Results Accordion
        $("#forecastvis").show();

        // Call API
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

                    // Write results to the DOM in the results accordion
                    $("#resultsForecast").append("Day " + (i + 1) + ": Avg. Temp.: " + temp.toFixed(1) + " | " + windy + " | " + cloudy + "<br>");
                }

            });
    }


    // Restaurant () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 JG
    //-------------------------------------------

    function restaurantUpdate(needRestaurant) {
        // Check to see if option is checked
        if (needRestaurant) {
            // Show Results Accordion
            $("#restaurantvis").show();
            $("#restaurant-table").show();

            // Call API
            var apiKey = " d0782c26de92e778b76dcefa06a8ea95";
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/search?" + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET",
                headers: { "user-key": apiKey },
            }).then(function (response) {

                // console.log("-----restUpdate----");
                // console.log(response);
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
                    // Write results to the DOM in the results accordion
                    $("#restaurant-table > tbody").append(newRow);
                }

            })
        }
    }

    // Dessert Spots () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 JG
    //-------------------------------------------
    function dessertsUpdate(needDessert) {
        // Check to see if option is checked
        if (needDessert) {
            // Show Results Accordion
            $("#dessertvis").show();

            // Call API
            var apiKey = " d0782c26de92e778b76dcefa06a8ea95";
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/search?q=desserts" + "&lat=" + latitude + "&lon=" + longitude,

                method: "GET",
                headers: { "user-key": apiKey },

            }).then(function (response) {

                // console.log(response);
                var results = response;
                // console.log(results);
                // console.log("------Test----");
                // console.log(results.restaurants[0].restaurant.name);
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
                    // Write results to the DOM in the results accordion
                    $("#desserts-table > tbody").append(newRow);
                    // //    console.log("!!!!!!LOCATION!!!!");
                    // //    console.log(results.restaurants[i].restaurant.location);
                }

            })
        }
    }

    // Movies Nearby () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 JG
    //-------------------------------------------

    function updateMovies(needMovies) {

        // Check to see if option is checked
        if (needMovies) {

            // Show Results Accordion
            $("#moviesvis").show();

            // Call API

            var apiKey = "wgkpzjdk25tfwrybxqvrtv2p";
            var queryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + dateYear + "-" + dateMonth + "-" + dateDay + "&zip=" + userPlace + "&api_key=" + apiKey;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // console.log(queryURL);
                // console.log(response);
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

                    // Write results to the DOM in the results accordion
                    $("#movie-table > tbody").append(newRow);

                }


            });
        }
    }



    // Help Data - return in modal
    //-------------------------------------------
    //-------------------------------------------

    // Conversation Starters () function
    //-------------------------------------------
    // Tested and Signed Off - 01/__/2020 PLK
    //-------------------------------------------

    $("#starters").on("click", function (event) {

        // Prevent default action on click
        event.preventDefault();

        // Query the data from an Array
        //-----TO DO



    });


    // Day in History API Data
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

    // AJAX Call when 'Date In History' button clicked

    $("#history").on("click", function (event) {

        // Prevent default action on click
        event.preventDefault();

        if (userDate === "") {

            // Set error message
            $("#resultsHistory").html("Please submit the form above with a valid date.");

        } else {

            getFacts();
        };


    });


    // Joke of the Day API Data
    //-------------------------------------------
    // Tested and Signed Off - 01/24/2020 PLK
    //-------------------------------------------

    // AJAX Call with settings when 'Joke of the Day' button clicked

    $("#jokes").on("click", function (event) {

        // Prevent default action on click
        event.preventDefault();

        // AJAX Call to API
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

        // AJAX Call to API
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


    // Day in History API Data
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

    function getFacts() {

        // Retrieve user information stored in database

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

                // Assign db values for Day and Month to variables
                dateMonth = snapshot.child("month").val();
                dateDay = snapshot.child("day").val();
            });
            // console.log("Outside call Month and Day");
            // console.log(dateMonth);
            // console.log(dateDay);

            // AJAX Call to API
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
    }


    // Functions to Print/Email
    //-------------------------------------------
    // Tested and Signed Off - __/__/2020 INITIALS
    //-------------------------------------------

    // If so, need user's email address
    // --------------TO DO------------------     


    // Exit button clicked function
    //-------------------------------------------
    // Tested and Signed Off - 01/25/2020 PLK
    //-------------------------------------------

    $("#exit").click(function () {

        // console.log("----- Record Key-----");
        // console.log(userRecordKey);


        // Check to see if there is a record in the database for the user
        if (userID !== "") {

            // If record exists, delete it

            var deleteRef = database.ref(userRecordKey);

            function delAssets() {
                deleteRef.set({});
                console.log("Deleted: " + userRecordKey);
            };

            delAssets();

            // Open farewell.html in the same tab
            window.open("goodbye.html", '_self');

        } else {

            // Open farewell.html in the same tab
            window.open("goodbye.html", '_self');
        }

    })

});
