function updateWeather() {
    let zip = currentUser.preferences.zipCode;

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



    const apiKey = "7a6a7145f6a1c220db94cc631bef319e";
    let url = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zip + ",&APPID=" + apiKey;
    // Ajax call to weather API

    $.ajax({
        url: url,
        method: "GET"
    }).done(function (response) {

        //        console.log(response);

        // assign reponse to weather weatherAPIObject
        let weatherAPIObject = response;

        // Retrive current temperature and convert it to fahrenheit
        let kelvinTemperature = weatherAPIObject.list[0].main.temp;

        //fixed conversion math and included html for the fahrenheit symbol

        let fahrenheit = Math.round(((kelvinTemperature - 273.15) * 1.8) + 32)

        // Retrive Icon code
        let iconCode = weatherAPIObject.list[0].weather[0].icon;
        // Build Icon link
        //        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";


        $(".weather-link").html(weatherIcons[iconCode])
        $(".weather-link").attr("href", weatherLink)
        $("#temperature").html(fahrenheit + " &#8457")


    });
}
// updateWeather();
