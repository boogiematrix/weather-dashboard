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
const template = `  <h2>Your City</h2>
                    <p>Temperature:</p>
                    <p>Humidity:</p>
                    <p>Wind Speed:</p>
                    <p>UV Index</p>`
const apiKey = ''
const searchHistory = document.getElementById('searchHistory')

//geocode call
//fetch(api.openweathermap.org/geo/1.0/direct?q={cityInput}&limit=1&appid=${apiKey})

//weather call
//fetch(api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apiKey})

//5 day forecast
//fetch(api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&cnt=5&appid=${apiKey})

cityInput.addEventListener('keyup', function (e) {
    e.preventDefault()
    if (e.keycode === 13 || e.key === 'Enter') {
        let searchItem = document.createElement('li');
        searchItem.classList.add('list-group-item')
        searchItem.textContent = cityInput.value;
        searchHistory.appendChild(searchItem)
        cityInput.value = ''
    }
})