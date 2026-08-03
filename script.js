// const searchInput = document.querySelector(".search-input input");
// const selectCityContainer = document.querySelector(".select-city-container");

// const allCitiesContainer = document.querySelector(".select-city-container ul");

// const switchName = document.querySelector(".switched-name");
// const weekDayContainer = document.querySelector(".week-day-select-container")
// let allWeatherData;

// let currentUnit = "metric";
// switchName.addEventListener("click", () => {

//     if (currentUnit === "metric") {
//         currentUnit = "imperial";
//         switchName.innerText = "Switch to Metric";
//     } else {
//         currentUnit = "metric";
//         switchName.innerText = "Switch to Imperial";
//     }


//     document.querySelector(".celcius-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "metric");

//     document.querySelector(".fahrenheit-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "imperial");

//     document.querySelector(".kmh-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "metric");

//     document.querySelector(".mph-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "imperial");

//     document.querySelector(".millimeters-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "metric");

//     document.querySelector(".inches-in-switch")
//         .classList.toggle("options-container-active", currentUnit === "imperial");
// });

// searchInput.addEventListener("input", (e) => {
//     const inputTxt = e.target.value;
//     if (inputTxt.length >= 3) {
//         selectCityContainer.classList.add('select-city-container-active');
//         gettingAllCities(inputTxt, allCitiesContainer);
//     } else {
//         selectCityContainer.classList.remove('select-city-container-active');
//     }
// })

// document.addEventListener('click', async (e) => {
//     if (!selectCityContainer.contains(e.target)) {
//         selectCityContainer.classList.remove('select-city-container-active');
//     }
//     else {
//         if (e.target.tagName === "LI") {
//             searchInput.value = e.target.innerText;

//             const weatherData = await getWeatherByCity(searchInput.value);
//             allWeatherData = weatherData;
//             insertingWeatherData(weatherData)
//             insertingDailyForecast(weatherData);
//             insertingHourlyForecast(weatherData);
//             insertingWeekdays(weatherData);
//             console.log(weatherData);

//             selectCityContainer.classList.remove('select-city-container-active');
//         }
//     }
// })



// async function getCities(city) {
//     const res = await fetch(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
//     );

//     const data = await res.json();

//     return data.results;
// }

// async function getWeatherByCity(city) {
//     const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
//     const geoData = await geoRes.json();
//     console.log(geoData)
//     const lat = geoData.results[0].latitude;
//     const lon = geoData.results[0].longitude;
//     const cityName = geoData.results[0].name;
//     const countryName = geoData.results[0].country;
//     const place = document.querySelector(".country-temperature .weather-left .city");
//     place.innerText = `${cityName},${countryName}`;
//     console.log(`${lat} and ${lon}`)
//     let weatherRes

//     // debugger
//     if (currentUnit === "metric") {
//         weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weathercode&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`);
//     } else {
//         weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weathercode&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`);
//     }
//     const weatherData = await weatherRes.json();
//     return weatherData;
// }


// function insertingWeatherData(data) {
//     const dateTime = data.current.time;
//     const date = new Date(dateTime);

//     const fullDate = date.toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: "numeric"
//     });

//     document.querySelector(".weather-left .date").innerText = fullDate;
//     document.querySelector(".weather-right .temp").innerText = `${data.current.temperature_2m}°`;
//     document.querySelector(".details-card .feels-like").innerText = data.current.apparent_temperature + data.current_units.temperature_2m;
//     document.querySelector(".details-card .Humidity").innerText = data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
//     document.querySelector(".details-card .wind").innerText = data.current.wind_speed_10m +" "+ data.current_units.wind_speed_10m;
//     document.querySelector(".details-card .precipitation").innerText = data.current.precipitation +" "+ data.current_units.precipitation;
// }



// // function for daily forecast details
// function insertingDailyForecast(data) {
//     const daily = data.daily;
//     const dates = daily.time;
//     const maxTemps = daily.temperature_2m_max;
//     const minTemps = daily.temperature_2m_min;
//     // debugger


//     const container = document.querySelector(".daily-forecast-details");
//     container.innerHTML = "";
//     dates.forEach((date, index) => {
//         const day = new Date(date).toLocaleDateString("en-US", {
//             weekday: "short"
//         });
//         const max = maxTemps[index];
//         const min = minTemps[index];
//         const icon = getWeatherIcon(daily.weathercode[index]);
//         const card = document.createElement("div");
//         card.classList.add("day-forecast");
//         card.innerHTML = `<p>${day}</p>
//                     <img src= ${icon} alt="">
//                     <div class="daily-forecast-temperature">
//                       <p>${max}°</p>
//                       <p>${min}°</p>
//                     </div>`;

//         container.appendChild(card);
//     })


// }
// function insertingHourlyForecast(data) {
//     const hourly = data.hourly;
//     const times = hourly.time;
//     const temps = hourly.temperature_2m;
//     const codes = hourly.weathercode;

//     const container = document.querySelector(".hourly-list");
//     container.innerHTML = "";
    


//     const now = new Date();

//     const startIndex = times.findIndex(time =>
//         new Date(time) >= now
//     );

//     times.slice(startIndex, startIndex + 7).forEach((time, i) => {
//         const index = startIndex + i;

//         const hour = new Date(time).toLocaleTimeString("en-IN", {
//             hour: "numeric",
//             hour12: true
//         }).toUpperCase();

//         const temp = temps[index];
//         const icon = getWeatherIcon(codes[index]);

//         const item = document.createElement("div");
//         item.classList.add("one-hour-forecast");
//         item.innerHTML = `<div class="time-container">
//                     <img src=${icon} alt="">
//                     <p>${hour}</p>
//                   </div>
//                   <p>${temp}°</p>`;

//         container.appendChild(item);
//     })

// }

// function getWeatherIcon(code) {
//     if (code === 0) {
//         return `assets/images/icon-sunny.webp`
//     }
//     else if (code === 1 || code === 2) {
//         return `assets/images/icon-partly-cloudy.webp`;
//     }
//     else if (code === 3) {
//         return `assets/images/icon-overcast.webp`;
//     }
//     else if (code >= 45 && code <= 48) {
//         return `assets/images/icon-fog.webp`;
//     }
//     else if (code >= 51 && code <= 57) {
//         return `assets/images/icon-drizzle.webp`;
//     }
//     else if (code >= 61 && code <= 67) {
//         return `assets/images/icon-rain.webp`;
//     }
//     else if (code >= 71 && code <= 77) {
//         return `assets/images/icon-snow.webp`;
//     }
//     else if (code >= 80 && code <= 82) {
//         return `assets/images/icon-rain.webp`;
//     }
//     else if (code >= 85 && code <= 86) {
//         return `assets/images/icon-snow.webp`;
//     }
//     else {
//         if (code >= 95 && code <= 99)
//             return `assets/images/icon-storm.webp`;
//     }
//     return `assets/images/icon-sunny.webp`
// }



// // switch units
// document.addEventListener("DOMContentLoaded", () => {
//     const switchContainer = document.querySelector(".switch-container");
//     const unitsContainer = document.querySelector(".units-container");

//     const selectDay = document.querySelector(".select-day");

//     unitsContainer.addEventListener("click", () => {
//         switchContainer.classList.toggle("switch-container-active");
//     });

//     selectDay.addEventListener("click",()=>{
//         weekDayContainer.classList.toggle("week-day-select-container-active");
//         if(weekDayContainer.classList.contains("week-day-select-container-active")){
//             const allDays = document.querySelectorAll(".week-day-select-container-active p");
//             allDays.forEach((p,index) =>{
//                 p.addEventListener("click",() => insertingWeekDaysDataInHourlyForecast(index))
//             })
//             // console.log(allDays)
//         }
//     })

//     document.addEventListener("click", (e) => {
//         if (!unitsContainer.contains(e.target)) {
//             switchContainer.classList.remove("switch-container-active");
//         }
//         if(!selectDay.contains(e.target)){  
//             weekDayContainer.classList.remove("week-day-select-container-active");
//         }
//     });
// });
// function insertingWeekdays(data){
//     const times = data.daily.time;

//     const firstDay = new Date(times[0]).toLocaleDateString("en-US",{
//         weekday: "long"
//     })
//     document.querySelector(".select-day p").innerHTML = `<p>${firstDay} <span><img src="assets/images/icon-dropdown.svg" alt=""></span></p>`;
//     weekDayContainer.innerHTML = "";
    
//     times.forEach((time,i) =>{
//     const dayName = new Date(time).toLocaleDateString("en-IN",{
//         weekday: "long"
//     })
//     const p = document.createElement("p");
//     p.innerText = dayName;

//     weekDayContainer.appendChild(p);
//     })
// }
// // debugger
// function insertingWeekDaysDataInHourlyForecast(index){
//     const selectedDate = allWeatherData.daily.time[index];

//     const hourly = allWeatherData.hourly;
//     const times = hourly.time;
//     const temps = hourly.temperature_2m;
//     const codes = hourly.weathercode;

//     const container = document.querySelector(".hourly-list");
//     container.innerHTML = "";

    
//     const filteredIndexes = times
//         .map((time, i) => time.startsWith(selectedDate) ? i : -1)
//         .filter(i => i !== -1);

    
//     filteredIndexes.slice(0, 7).forEach(i => {

//         const hour = new Date(times[i]).toLocaleTimeString("en-IN", {
//             hour: "numeric",
//             hour12: true
//         });

//         const item = document.createElement("div");
//         item.classList.add("one-hour-forecast");

//         item.innerHTML = `
//             <div class="time-container">
//                 <img src="${getWeatherIcon(codes[i])}" alt="">
//                 <p>${hour}</p>
//             </div>
//             <p>${temps[i]}°</p>
//         `;

//         container.appendChild(item);
//     });

//     // update UI
//     const dayName = new Date(selectedDate).toLocaleDateString("en-US", {
//         weekday: "long"
//     });

//     document.querySelector(".select-day p").innerHTML =
//         `${dayName} <span><img src="assets/images/icon-dropdown.svg" alt=""></span>`;
// }




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


searchInput.addEventListener("input",async ()=>{
    const cityName = searchInput.value.trim();
    const res = await getCities(cityName)
    showingCities(cityName,res);
    // console.log(res)
})
allCitiesContainer.addEventListener('click', async (e) => {
    if (!selectCityContainer.contains(e.target)) {
        selectCityContainer.classList.remove('select-city-container-active');
    }
    else {
        if (e.target.tagName === "LI") {
            searchInput.value = e.target.innerText;

            // const weatherData = await getWeatherByCity(searchInput.value);
            place.innerText = e.target.dataset.city;
            const lat = e.target.dataset.latitude;
            const long = e.target.dataset.longitude;
            const weatherData = await loadWeatherByCoordinates(searchInput.value,lat,long)
            updateCurrentWeather(weatherData);
            // console.log(weatherData)
            // allWeatherData = weatherData;
            // insertingWeatherData(weatherData)
            // insertingDailyForecast(weatherData);
            // insertingHourlyForecast(weatherData);
            // insertingWeekdays(weatherData);
            // console.log(weatherData);


            selectCityContainer.classList.remove('select-city-container-active');
        }
    }
})

async function loadWeatherByCoordinates(inputCity,lat,long){
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weathercode&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`)
    const weatherData = await weatherRes.json();
    return weatherData;
}
function updateCurrentWeather(weatherData){
    const dateTime = weatherData.current.time;
    const currentTime = new Date(dateTime);
    
    const fullDate = currentTime.toLocaleDateString("en-IN",{
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })
    
    date.innerText = fullDate;
    console.log(weatherData)
    temp.innerText = `${weatherData.current.temperature_2m}°`
    feelsLike.innerText = weatherData.current.apparent_temperature + weatherData.current_units.temperature_2m;
    humidity.innerText = weatherData.current.relative_humidity_2m + weatherData.current_units.relative_humidity_2m;
    wind.innerText = weatherData.current.wind_speed_10m +" "+ weatherData.current_units.wind_speed_10m;
    precipitation.innerText = weatherData.current.precipitation +" "+ weatherData.current_units.precipitation;

}

function showingCities(city,allCities){
    if(city.length<= 1) return;
    allCitiesContainer.innerHTML ="";
    if(city.length >= 3){
        selectCityContainer.classList.add('select-city-container-active');
        if(allCities){
            allCities.forEach(city=>{
                const li = document.createElement("li");
                li.innerText = `${city.name}, ${city.admin1}, ${city.country}`;
                li.dataset.latitude = city.latitude;
                li.dataset.longitude = city.longitude;
                li.dataset.city = city.name;
                allCitiesContainer.append(li);
            })
        }
        
    }
    else{
        selectCityContainer.classList.remove('select-city-container-active');
    }
}
async function getCities(city){
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    const data = await res.json();
    return data.results;
}

searchBtn.addEventListener("click",()=>{
    console.log(cityName)
})



