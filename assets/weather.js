/*
GIVEN a weather dashboard with form inputs
TODO design the web layout
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
TODO display select weather data for a city. add city to list after search bar
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
TODO identify path to necessary data. use moment to insert date. select an icon for certain conditions.
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
TODO designate a span to hold the uv data and change bg color
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
TODO set up 5 cards with the requisite structure
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
TODO each city in search history is a link to city data
*/

const cityInput = document.getElementById('city');
const currentWeatherBox = document.getElementById('currentWeatherBox');
const fiveDayWeatherBox = document.getElementById('fiveDayWeatherBox');
const apiKey = 'f7539453617679dd406d1369cc371b9e';
let cityGeocodeJson;
let today = moment().format('MM/DD/YYYY')
//let weather;
const searchHistory = document.getElementById('searchHistory');
//geocode call
const geocode = async () => {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=1&appid=${apiKey}`;

    try {
        let response = await fetch(geocodeUrl);
        if (response.ok) {
            cityGeocodeJson = await response.json();
            console.log(cityGeocodeJson)
            return cityGeocodeJson
        }
    }
    catch (error) { console.log(error) }
}
//weather call
const currentWeather = async () => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityGeocodeJson[0].lat}&lon=${cityGeocodeJson[0].lon}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apiKey}`;
    try {
        let response = await fetch(currentWeatherUrl);
        if (response.ok) {
            let currentWeatherJson = await response.json();
            console.log(currentWeatherJson)
            return currentWeatherJson
        }
    }
    catch (error) { console.log(error) }
}
//5 day forecast
const fiveDayForecast = async () => {
    const fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeocodeJson[0].lat}&lon=${cityGeocodeJson[0].lon}&units=imperial&appid=${apiKey}`;

    try {
        let response = await fetch(fiveDayUrl);
        if (response.ok) {
            let fiveDayJson = await response.json();
            console.log(fiveDayJson)
            return fiveDayJson
        }
    }
    catch (error) { console.log(error) }
}

cityInput.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.keycode === 13 || e.key === 'Enter') {
        geocode()
            .then(function () {
                return Promise.all([currentWeather(), fiveDayForecast()])
            })
            .then(weather => {
                console.log(weather)
                return weather
            })
            .then(function (weather) {
                const currentWeatherTemplate = `  <h2>${weather[1].city.name} ${today} <img src='http://openweathermap.org/img/wn/${weather[0].current.weather[0].icon}@2x.png'></h2>
                            <p>Temperature: ${weather[0].current.temp}°F </p>
                            <p>Humidity: ${weather[0].current.humidity}% </p>
                            <p>Wind Speed: ${weather[0].current.wind_speed}MPH </p>
                            <p>UV Index <span id='uvi'>${weather[0].current.uvi}</span> </p>`

                const fiveDayWeatherTemplate = `
                    <h2>5-Day Forcast</h2>
                    <div class='card col-2'>
                        <p>${moment().add(1, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[7].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[7].main.temp} °F</p>
                        <p>${weather[1].list[7].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-2'>
                        <p>${moment().add(2, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[15].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[15].main.temp} °F</p>
                        <p>${weather[1].list[15].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-2'>
                        <p>${moment().add(3, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[23].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[23].main.temp} °F</p>
                        <p>${weather[1].list[23].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-2'>
                        <p>${moment().add(4, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[31].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[31].main.temp} °F</p>
                        <p>${weather[1].list[31].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-2'>
                        <p>${moment().add(5, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[39].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[39].main.temp} °F</p>
                        <p>${weather[1].list[39].main.humidity} % Humidity</p>
                    </div>`

                currentWeatherBox.innerHTML = currentWeatherTemplate;
                fiveDayWeatherBox.innerHTML = fiveDayWeatherTemplate;

                const uvIndex = document.getElementById('uvi');
                if (weather[0].current.uvi > 6) {
                    uvIndex.classList.add('severe')
                } else if (weather[0].current.uvi > 3) {
                    uvIndex.classList.add('moderate')
                } else {
                    uvIndex.classList.add('safe')
                }

            })

        let searchItem = document.createElement('li');
        searchItem.classList.add('list-group-item')
        searchItem.textContent = cityInput.value;
        searchHistory.appendChild(searchItem)
        cityInput.value = ''
    }
})