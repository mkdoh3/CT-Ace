function updateWeather() {
    const zip = currentUser.preferences.zipCode;

    const thunderstorm = "<p id='temperature'></p><div class='icon thunder-storm'><div class='cloud'></div><div class='lightning'><div class='bolt'></div><div class='bolt'></div></div></div>"

    const sunShower = "<p id='temperature'></p><div class='icon sun-shower'><div class='cloud'></div><div class='sun'><div class='rays'></div></div><div class='rain'></div></div>"

    const rain = "<p id='temperature'></p><div class='icon rainy'><div class='cloud'></div><div class='rain'></div></div>"

    const snow = "<p id='temperature'></p><div class='icon flurries'><div class='cloud'></div><div class='snow'><div class='flake'></div><div class='flake'></div></div></div>"

    const clear = "<p id='temperature'></p><div class='icon sunny'><div class='sun'><div class='rays'></div></div></div>"

    const cloudy = "<p id='temperature'></p><div class='icon cloudy'><div class='cloud'></div><div class='cloud'></div></div>"

    const weatherLink = "https://www.wunderground.com/weather/us/il/" + zip

    const weatherIcons = {
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
    const url = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zip + ",&APPID=" + apiKey;
    // Ajax call to weather API

    $.ajax({
        url: url,
        method: "GET"
    }).done(function (response) {
        // assign reponse to weather weatherAPIObject
        const weatherAPIObject = response;
        // Retrive current temperature and convert it to fahrenheit
        const kelvinTemperature = weatherAPIObject.list[0].main.temp;
        //fixed conversion math and included html for the fahrenheit symbol
        const fahrenheit = Math.round(((kelvinTemperature - 273.15) * 1.8) + 32)
        // Retrive Icon code
        const iconCode = weatherAPIObject.list[0].weather[0].icon;
        // Build Icon link
        $(".weather-link").html(weatherIcons[iconCode])
        $(".weather-link").attr("href", weatherLink)
        $("#temperature").html(fahrenheit + " &#8457")


    });
}
