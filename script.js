
// DOM Elements
const searchInput = document.querySelector(".search-input input");
const searchBtn = document.querySelector(".search-btn");

const place = document.querySelector(".city");
const date = document.querySelector(".date")
const temp = document.querySelector(".temp")

const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".Humidity")
const wind = document.querySelector(".wind")
const precipitation = document.querySelector(".precipitation");

const selectCityContainer = document.querySelector(".select-city-container");
const allCitiesContainer = document.querySelector(".select-city-container ul");


const hourlyContainer = document.querySelector(".hourly-list");

const dailyForecastContainer = document.querySelector(".daily-forecast-details");

const selectDayContainer = document.querySelector(".select-day");
const weekDaySelectContainer = document.querySelector(".week-day-select-container")
const allDays = weekDaySelectContainer.querySelectorAll("p")

const switchContainer = document.querySelector(".switch-container");
const unitsContainer = document.querySelector(".units-container");
const switchName = document.querySelector(".switched-name");

let cityInfo = null;

searchInput.addEventListener("input", async () => {
    cityInfo = null;
    const cityName = searchInput.value.trim();
    const res = await getCities(cityName)
    showingCities(cityName, res);
})
allCitiesContainer.addEventListener('click', (e) => {
    if (!selectCityContainer.contains(e.target)) {
        selectCityContainer.classList.remove('select-city-container-active');
    }
    else {
        if (e.target.tagName === "LI") {
            searchInput.value = e.target.innerText;

            cityInfo = {
                city: e.target.dataset.city,
                lat: e.target.dataset.latitude,
                long: e.target.dataset.longitude
            }


            selectCityContainer.classList.remove('select-city-container-active');
        }
    }
})


async function loadWeatherByCoordinates(lat, long) {
    let weatherRes;
    if (currentUnit === "metric") {
        weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weathercode&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`);
    } else {
        weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weathercode&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`);
    }
    const weatherData = await weatherRes.json();
    return weatherData;
}
function updateCurrentWeather(weatherData) {
    const dateTime = weatherData.current.time;
    const currentTime = new Date(dateTime);

    const fullDate = currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })

    date.innerText = fullDate;
    temp.innerText = `${weatherData.current.temperature_2m}°`
    feelsLike.innerText = weatherData.current.apparent_temperature + weatherData.current_units.temperature_2m;
    humidity.innerText = weatherData.current.relative_humidity_2m + weatherData.current_units.relative_humidity_2m;
    wind.innerText = weatherData.current.wind_speed_10m + " " + weatherData.current_units.wind_speed_10m;
    precipitation.innerText = weatherData.current.precipitation + " " + weatherData.current_units.precipitation;

}

function showingCities(city, allCities) {
    if (city.length <= 1) return;
    allCitiesContainer.innerHTML = "";
    if (city.length >= 3) {
        selectCityContainer.classList.add('select-city-container-active');
        if (allCities) {
            allCities.forEach(city => {
                const li = document.createElement("li");
                li.innerText = `${city.name}, ${city.admin1}, ${city.country}`;
                li.dataset.latitude = city.latitude;
                li.dataset.longitude = city.longitude;
                li.dataset.city = city.name;
                allCitiesContainer.append(li);
            })
        }

    }
    else {
        selectCityContainer.classList.remove('select-city-container-active');
    }
}
async function getCities(city) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    const data = await res.json();
    return data.results;
}
let data = null;
searchBtn.addEventListener("click", async () => {
    if (cityInfo) {
        place.innerText = cityInfo.city;
        await refreshWeather();
    }
})
async function refreshWeather(){
    if(!cityInfo) return;
    const weatherData = await loadWeatherByCoordinates(cityInfo.lat,cityInfo.long);
    data = weatherData;
    updateCurrentWeather(weatherData);
    updateHourlyForeCast(weatherData)
    updateDailyForecast(weatherData);
    
    renderSelectedDay(weatherData.daily.time,0);
}

// hourly forecast 
function getWeatherIcon(code) {
    if (code === 0) {
        return `assets/images/icon-sunny.webp`
    }
    else if (code === 1 || code === 2) {
        return `assets/images/icon-partly-cloudy.webp`;
    }
    else if (code === 3) {
        return `assets/images/icon-overcast.webp`;
    }
    else if (code >= 45 && code <= 48) {
        return `assets/images/icon-fog.webp`;
    }
    else if (code >= 51 && code <= 57) {
        return `assets/images/icon-drizzle.webp`;
    }
    else if (code >= 61 && code <= 67) {
        return `assets/images/icon-rain.webp`;
    }
    else if (code >= 71 && code <= 77) {
        return `assets/images/icon-snow.webp`;
    }
    else if (code >= 80 && code <= 82) {
        return `assets/images/icon-rain.webp`;
    }
    else if (code >= 85 && code <= 86) {
        return `assets/images/icon-snow.webp`;
    }
    else {
        if (code >= 95 && code <= 99)
            return `assets/images/icon-storm.webp`;
    }
    return `assets/images/icon-sunny.webp`
}
function updateHourlyForeCast(data) {

    const hourly = data.hourly;
    const times = hourly.time;
    const temps = hourly.temperature_2m;
    const weatherCodes = hourly.weathercode;
    const now = new Date();

    hourlyContainer.innerHTML = "";
    const options = {
        hour: "numeric",
        hour12: true
    }

    const startIndex = times.findIndex(time => new Date(time) >= now)
    times.slice(startIndex, startIndex + 7).forEach((time, i) => {
        const index = startIndex + i;

        const hourForecastContainer = document.createElement('div');
        hourForecastContainer.classList.add('one-hour-forecast')
        hourForecastContainer.innerHTML = `
        <div class="time-container">
            <img src="${getWeatherIcon(weatherCodes[index])}" alt="">
            <p>${new Date(time).toLocaleString("en-IN", options).toUpperCase()}</p>
        </div>
        <p>${temps[index]}°</p>`;
        hourlyContainer.append(hourForecastContainer);
    })
}


// Daily forecast
function updateDailyForecast(data) {
    const dailyData = data.daily;
    const max = dailyData.temperature_2m_max;
    const min = dailyData.temperature_2m_min;

    const dates = dailyData.time;
    const weatherCode = dailyData.weathercode;

    dailyForecastContainer.innerHTML = "";
    dates.forEach((date, index) => {
        const day = new Date(date).toLocaleDateString("en-IN", {
            weekday: "short"
        });
        const maxTemp = max[index];
        const minTemp = min[index];
        const icon = getWeatherIcon(weatherCode[index]);

        const card = document.createElement("div");
        card.classList.add("day-forecast");
        card.dataset.dayIndex = index;
        card.innerHTML = `
            <p>${day}</p>
            <img src="${icon}" alt="">
            <div class="daily-forecast-temperature">
                <p>${maxTemp}°</p>
                <p>${minTemp}°</p>
            </div>`;
        dailyForecastContainer.append(card);
    })
}


// week day select
document.addEventListener("DOMContentLoaded", (e) => {

     allDays.forEach((p, index) => {
  
        p.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!data) return;

            renderSelectedDay(data.daily.time, index);
            updateSelectedDayHoursTemperature(data, index);

            weekDaySelectContainer.classList.remove("week-day-select-container-active");

        });

    });


    selectDayContainer.addEventListener("click",()=>{
        weekDaySelectContainer.classList.toggle("week-day-select-container-active");
        if (!data) return;
        allDays.forEach((p, index) => {
            p.innerText = new Date(data.daily.time[index]).toLocaleString(
                "en-IN",
                {
                    weekday: "long"
                }
            );
            p.dataset.dayIndex = index;
        });
    })
    
    
})
function updateSelectedDayHoursTemperature(data,index){
    if(index === 0) {
        updateHourlyForeCast(data);
        return;
    }
    const selectedDate = data.daily.time[index];
    const hourlyData = data.hourly;
    const times = hourlyData.time;
    const temps = hourlyData.temperature_2m;
    const codes = hourlyData.weathercode;
    hourlyContainer.innerHTML = "";
        const filteredIndexes = times
        .map((time, i) => time.startsWith(selectedDate) ? i : -1)
        .filter(i => i !== -1);
    filteredIndexes.slice(0,7).forEach(i =>{
        const hour = new Date(times[i]).toLocaleString("en-IN",{
            hour: "numeric",
            hour12:true
        })
        const hourForecastContainer = document.createElement('div');
        hourForecastContainer.classList.add('one-hour-forecast')
        hourForecastContainer.innerHTML = `
        <div class="time-container">
            <img src="${getWeatherIcon(codes[i])}" alt="">
            <p>${hour.toUpperCase()}</p>
        </div>
        <p>${temps[i]}°</p>`;
        hourlyContainer.append(hourForecastContainer);
    })
}



function renderSelectedDay(days,currentIndex){
    const today = selectDayContainer.querySelector("p");
    const currentDay = new Date(days[currentIndex]).toLocaleString("en-IN",{weekday : "long"});
    today.dataset.dayIndex = currentIndex;
    today.innerHTML = `${currentDay} <span><img src="assets/images/icon-dropdown.svg" alt=""></span>`
}



// switch units
let currentUnit = "metric";
switchName.addEventListener("click",async () =>{
    // if(!data) return;


    

    if(currentUnit === "metric"){
        currentUnit = "imperial";
        switchName.innerText = "Switch to Metric";
    }
    else{
        currentUnit = "metric";
        switchName.innerText = "Switch to Imperial";
    }
    await refreshWeather();

    document.querySelector(".celcius-in-switch").classList.toggle("options-container-active",currentUnit === "metric");

    document.querySelector(".fahrenheit-in-switch").classList.toggle("options-container-active",currentUnit === "imperial");

    document.querySelector(".kmh-in-switch").classList.toggle("options-container-active",currentUnit === "metric");

    document.querySelector(".mph-in-switch").classList.toggle("options-container-active",currentUnit === "imperial");

    document.querySelector(".millimeters-in-switch").classList.toggle("options-container-active",currentUnit === "metric");

    document.querySelector(".inches-in-switch").classList.toggle("options-container-active",currentUnit === "imperial");
})
document.addEventListener("DOMContentLoaded",(e) =>{
    console.log("hi")
    unitsContainer.addEventListener("click",() =>{
        switchContainer.classList.toggle("switch-container-active");
    })
    document.addEventListener("click",(e)=>{
        if(!unitsContainer.contains(e.target)){
            switchContainer.classList.remove("switch-container-active");
        }
    })
})


