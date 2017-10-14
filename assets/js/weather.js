$(document).ready(function () {
    console.log("current user", currentUser)
    console.log("weather function is running");
    //    var zip = currentUser.zipCode;


    //we'll have to figure out how to make all of these different api calls
    //currently when the weather js runs currentUser.zipCode is undefined and isnt defined until after the fact


    var zip = 60643
    var apiKey = "7a6a7145f6a1c220db94cc631bef319e";
    var url = "http://api.openweathermap.org/data/2.5/forecast?zip=" + zip + ",&APPID=" + apiKey;

    // Ajax call to weather API

    $.ajax({
        url: url,
        method: "GET"
    }).done(function (response) {

        // assign reponse to weather weatherAPIObject
        var weatherAPIObject = response;

        // Retrive current temperature and convert it to fahrenheight
        var kelvinTemperature = weatherAPIObject.list[0].main.temp;


        //fixed conversion math and included html for the fahrenheight symbol

        var fahrenheight = ((kelvinTemperature - 273.15) * 1.8) + 32

        // Retrive Icon code
        var iconCode = weatherAPIObject.list[0].weather[0].icon;
        // Build Icon link
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

        var container = $("<div>").addClass("row");
        var img = $("<img>").attr("src", iconUrl).addClass("col-xs-6");
        var temperatureDiv = $("<div>");
        temperatureDiv.html("<p> Current Temperature is: " + fahrenheight + " &#8457").addClass("col-xs-6");


        container.append(img, temperatureDiv)

        // Append to HTML

        $(".weatherInfo").append(container)




    });






});
