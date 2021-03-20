

const cityInput = document.getElementById('city');
const currentWeatherBox = document.getElementById('currentWeatherBox');
const fiveDayWeatherBox = document.getElementById('fiveDayWeatherBox');
const searchHistory = document.getElementById('searchHistory');

const apiKey = 'f7539453617679dd406d1369cc371b9e';

let today = moment().format('MM/DD/YYYY')
let cityGeocodeJson;
let cityName

//geocode request for longitude and latitude
const geocode = async () => {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

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
//current weather info request
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
//5 day forecast data request
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
//puts fetch requests in a promise chain and renders data in html
const renderWeather = () => {
    geocode()
        .then(function () {
            return Promise.all([currentWeather(), fiveDayForecast()])
        })
        .then(
            function (weather) {
                const currentWeatherTemplate = `  <h2>${weather[1].city.name} ${today} <img src='http://openweathermap.org/img/wn/${weather[0].current.weather[0].icon}@2x.png'></h2>
                            <p>Temperature: ${weather[0].current.temp}°F </p>
                            <p>Humidity: ${weather[0].current.humidity}% </p>
                            <p>Wind Speed: ${weather[0].current.wind_speed}MPH </p>
                            <p>UV Index <span id='uvi'>${weather[0].current.uvi}</span> </p>`

                const fiveDayWeatherTemplate = `
                    <h2>5-Day Forcast</h2>
                    <div class='card col-4 col-lg-2'>
                        <p>${moment().add(1, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[7].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[7].main.temp} °F</p>
                        <p>${weather[1].list[7].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p>${moment().add(2, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[15].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[15].main.temp} °F</p>
                        <p>${weather[1].list[15].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p>${moment().add(3, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[23].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[23].main.temp} °F</p>
                        <p>${weather[1].list[23].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p>${moment().add(4, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[31].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[31].main.temp} °F</p>
                        <p>${weather[1].list[31].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p>${moment().add(5, 'd').format('MM/DD/YYYY')}</p>
                        <p><img src='http://openweathermap.org/img/wn/${weather[1].list[39].weather[0].icon}@2x.png'></p>
                        <p>${weather[1].list[39].main.temp} °F</p>
                        <p>${weather[1].list[39].main.humidity} % Humidity</p>
                    </div>`

                currentWeatherBox.innerHTML = currentWeatherTemplate;
                fiveDayWeatherBox.innerHTML = fiveDayWeatherTemplate;
                //determines the background color of the uv index value
                const uvIndex = document.getElementById('uvi');
                if (weather[0].current.uvi > 6) {
                    uvIndex.classList.add('severe')
                } else if (weather[0].current.uvi > 3) {
                    uvIndex.classList.add('moderate')
                } else {
                    uvIndex.classList.add('safe')
                }

            })
}

//triggers the render function and prepends the search history when the user hits enter
cityInput.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.keycode === 13 || e.key === 'Enter') {
        cityName = cityInput.value
        renderWeather();

        let searchItem = document.createElement('li');
        searchItem.classList.add('list-group-item')
        searchItem.textContent = cityInput.value;
        searchHistory.prepend(searchItem)
        cityInput.value = ''

        localStorage.setItem('searchHistory', searchHistory.innerHTML)
    }
})
//renders relevant data when the user clicks on an item in the search history
searchHistory.addEventListener('click', function (e) {
    cityName = e.target.textContent;
    renderWeather();
})

let storage = localStorage.getItem('searchHistory')

if (storage) {
    searchHistory.innerHTML = storage;
}