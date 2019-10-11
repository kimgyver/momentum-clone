const API_KEY = "db924aa1722406eb1fb28407c06cf5a0";
const COORDS = 'coords';

const weather = document.querySelector(".js-weather");
const weatherForecast = document.querySelector(".js-weather-forecast");

const weatherImage = {
    'clear sky': 's',
    'few clouds': '10c',
    'scattered clouds': '30c',
    'broken clouds': '60c',
    'overcast clouds': '100c',
    'light rain': '50r',
    'moderate rain': 'r',
    'shower rain': 'sh'
};

function getWeatherImage(desc) {
    const svg = weatherImage[desc];
    if (svg == null) {
        // return desc;
        return "";
    }
    const imageTag = `<img src='./weather-svg/${svg}.svg' width=19 height=19>`;
    return imageTag;
}

function date2string(date, showDate, showTime) {
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    let text = "";
    if (showDate) {
        text += `${year}-${month}-${day < 10 ? `0${day}` : day} `;
    }
    if (showTime) {
        text += `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    }
    return text;
}

function getWeatherForecast(lat, lng) {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        // console.log(json);
        
        let text = "<table><tr><td>";
        let prevDate = "";
//        json.list.forEach(function(element) {
        let element = null;
        for (i = 0; i < 24; i ++) {
            element = json.list[i];
            const date = new Date(element.dt_txt);
            let changedDate = new Date();
            changedDate.setTime(date.getTime() + 12*60*60000); // GMT+12
            if (changedDate.getDate() !== prevDate) {
                const yearmonthday = date2string(changedDate, true, false);
                text += `</td><td style="vertical-align:top"><center>${yearmonthday}</center><hr>`;
            }
            const datetime = date2string(changedDate, false, true);
            prevDate = changedDate.getDate();
            const weatherDesc = getWeatherImage(element.weather[0].description) + element.weather[0].description;
            const temperature = parseFloat(element.main.temp).toFixed(1); // precision change
            text += `${datetime} ${temperature}°C ${weatherDesc} <br>`;
        }
        // });
        text += "</td></tr></table>"
        weatherForecast.innerHTML = text;
    });
}


function getCurrentWeather(lat, lng) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        //console.log(json);
        const weatherDesc = getWeatherImage(json.weather[0].description) + json.weather[0].description;
        const temperature = json.main.temp;
        const place = json.name;
        weather.innerHTML = `${weatherDesc} ${temperature}°C @ ${place}`;
    });
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
//    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coodsObj = {
        latitude,
        longitude
    };
    saveCoords(coodsObj);
    getCurrentWeather(latitude, longitude);
}

function handleGeoError() {
    console.log("Can't access geo location");
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);
        getCurrentWeather(parsedCoords.latitude, parsedCoords.longitude);
        getWeatherForecast(parsedCoords.latitude, parsedCoords.longitude);
    }
}

function init() {
    loadCoords();
}

init();