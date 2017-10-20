$(document).ready(function () {
    // console.log("current user", currentUser)
    console.log("weather function is running");

    //    var zip = currentUser.zipCode;

    //we'll have to figure out how to make all of these different api calls
    //currently when the weather js runs currentUser.zipCode is undefined and isnt defined until after the fact

    let thunderstorm = "<p id='temperature'></p><div class='icon thunder-storm'><div class='cloud'></div><div class='lightning'><div class='bolt'></div><div class='bolt'></div></div></div>"

    let sunShower = "<p id='temperature'></p><div class='icon sun-shower'><div class='cloud'></div><div class='sun'><div class='rays'></div></div><div class='rain'></div></div>"

    let rain = "<p id='temperature'></p><div class='icon rainy'><div class='cloud'></div><div class='rain'></div></div>"

    let snow = "<p id='temperature'></p><div class='icon flurries'><div class='cloud'></div><div class='snow'><div class='flake'></div><div class='flake'></div></div></div>"

    let clear = "<p id='temperature'></p><div class='icon sunny'><div class='sun'><div class='rays'></div></div></div>"

    let cloudy = "<p id='temperature'></p><div class='icon cloudy'><div class='cloud'></div><div class='cloud'></div></div>"

    let weatherLink = "https://www.wunderground.com/weather/us/il/" + zip


    let weatherIcons = {
        "11d": thunderstorm,
        "11n": thunderstorm,
        "10d": sunShower,
        "10n": rain,
        "09d": rain,
        "09n": rain,
        "13d": snow,
        "13n": snow,
        "01d": clear,
        "01n": cloudy,
        "02d": cloudy,
        "02n": cloudy,
        "03d": cloudy,
        "03n": cloudy,
        "04d": cloudy,
        "04n": cloudy,
        "50d": cloudy,
        "50n": cloudy
    }






    var zip = 60643;
    var apiKey = "7a6a7145f6a1c220db94cc631bef319e";
    var url = "http://api.openweathermap.org/data/2.5/forecast?zip=" + zip + ",&APPID=" + apiKey;
    // Ajax call to weather API

    $.ajax({
        url: url,
        method: "GET"
    }).done(function (response) {

        console.log(response);

        // assign reponse to weather weatherAPIObject
        var weatherAPIObject = response;

        // Retrive current temperature and convert it to fahrenheight
        var kelvinTemperature = weatherAPIObject.list[0].main.temp;

        //fixed conversion math and included html for the fahrenheight symbol

        var fahrenheight = Math.round(((kelvinTemperature - 273.15) * 1.8) + 32)

        // Retrive Icon code
        var iconCode = weatherAPIObject.list[0].weather[0].icon;
        // Build Icon link
        //        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";


        $(".weather-link").html(weatherIcons[iconCode])
        $(".weather-link").attr("href", weatherLink)
        $("#temperature").html(fahrenheight + " &#8457")


    });

}); // End Doucment.Ready();
