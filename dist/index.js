const cityInput = document.getElementById("city"), currentWeatherBox = document.getElementById("currentWeatherBox"), fiveDayWeatherBox = document.getElementById("fiveDayWeatherBox"), searchHistory = document.getElementById("searchHistory"), cityButton = document.getElementById("cityButton"), apiKey = "f7539453617679dd406d1369cc371b9e"; let cityGeocodeJson, cityName, today = moment().format("MM/DD/YYYY"); const geocode = async () => { const a = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`; try { let b = await fetch(a); if (b.ok) return cityGeocodeJson = await b.json(), console.log(cityGeocodeJson), cityGeocodeJson } catch (a) { console.log(a) } }, currentWeather = async () => { const a = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityGeocodeJson[0].lat}&lon=${cityGeocodeJson[0].lon}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apiKey}`; try { let b = await fetch(a); if (b.ok) { let a = await b.json(); return console.log(a), a } } catch (a) { console.log(a) } }, fiveDayForecast = async () => { const a = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeocodeJson[0].lat}&lon=${cityGeocodeJson[0].lon}&units=imperial&appid=${apiKey}`; try { let b = await fetch(a); if (b.ok) { let a = await b.json(); return console.log(a), a } } catch (a) { console.log(a) } }, renderWeather = () => {
    geocode().then(function () { return Promise.all([currentWeather(), fiveDayForecast()]) }).then(function (a) {
        const b = `  <h2>${a[1].city.name} ${today} <img id='icon' alt='${a[0].current.weather[0].description}' src='https://openweathermap.org/img/wn/${a[0].current.weather[0].icon}@2x.png'></h2>
                            <p>Temperature: ${a[0].current.temp}°F </p>
                            <p>Humidity: ${a[0].current.humidity}% </p>
                            <p>Wind Speed: ${a[0].current.wind_speed}MPH </p>
                            <p>UV Index <span id='uvi'>${a[0].current.uvi}</span> </p>`, c = `
                    <h2>5-Day Forcast</h2>
                    <div class='card col-4 col-lg-2'>
                        <p class='date'>${moment().add(1, "d").format("MM/DD/YYYY")}</p>
                        <p><img src='https://openweathermap.org/img/wn/${a[1].list[7].weather[0].icon}@2x.png' 
                            alt='${a[1].list[7].weather[0].description}'></p>
                        <p>${a[1].list[7].main.temp} °F</p>
                        <p>${a[1].list[7].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p class='date'>${moment().add(2, "d").format("MM/DD/YYYY")}</p>
                        <p><img src='https://openweathermap.org/img/wn/${a[1].list[15].weather[0].icon}@2x.png' 
                            alt='${a[1].list[15].weather[0].description}'></p>
                        <p>${a[1].list[15].main.temp} °F</p>
                        <p>${a[1].list[15].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-4 col-lg-2'>
                        <p class='date'>${moment().add(3, "d").format("MM/DD/YYYY")}</p>
                        <p><img src='https://openweathermap.org/img/wn/${a[1].list[23].weather[0].icon}@2x.png' 
                            alt='${a[1].list[23].weather[0].description}'></p>
                        <p>${a[1].list[23].main.temp} °F</p>
                        <p>${a[1].list[23].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-6 col-lg-2'>
                        <p class='date'>${moment().add(4, "d").format("MM/DD/YYYY")}</p>
                        <p><img src='https://openweathermap.org/img/wn/${a[1].list[31].weather[0].icon}@2x.png' 
                            alt='${a[1].list[31].weather[0].description}'></p>
                        <p>${a[1].list[31].main.temp} °F</p>
                        <p>${a[1].list[31].main.humidity} % Humidity</p>
                    </div>
                    <div class='card col-6 col-lg-2'>
                        <p class='date'>${moment().add(5, "d").format("MM/DD/YYYY")}</p>
                        <p><img src='https://openweathermap.org/img/wn/${a[1].list[39].weather[0].icon}@2x.png' 
                            alt='${a[1].list[39].weather[0].description}'></p>
                        <p>${a[1].list[39].main.temp} °F</p>
                        <p>${a[1].list[39].main.humidity} % Humidity</p>
                    </div>`; currentWeatherBox.innerHTML = b, fiveDayWeatherBox.innerHTML = c; const d = document.getElementById("uvi"); 6 < a[0].current.uvi ? d.classList.add("severe") : 3 < a[0].current.uvi ? d.classList.add("moderate") : d.classList.add("safe")
    })
}; cityInput.addEventListener("keyup", function (a) { a.preventDefault(), (13 === a.keycode || "Enter" === a.key) && initiateSearch }), cityButton.addEventListener("click", initiateSearch); function initiateSearch() { cityName = cityInput.value, renderWeather(); let a = document.createElement("li"); a.classList.add("list-group-item"), a.textContent = cityInput.value, searchHistory.prepend(a), cityInput.value = "", localStorage.setItem("searchHistory", searchHistory.innerHTML) } searchHistory.addEventListener("click", function (a) { cityName = a.target.textContent, renderWeather() }); let storage = localStorage.getItem("searchHistory"); storage && (searchHistory.innerHTML = storage);