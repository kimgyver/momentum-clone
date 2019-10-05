const API_KEY = "db924aa1722406eb1fb28407c06cf5a0";
const COORDS = 'coords';

const weather = document.querySelector(".js-weather");

function getWeather(lat, lng) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        //console.log(json);
        const weatherDesc = json.weather[0].main;
        const temperature = json.main.temp;
        const place = json.name;
        weather.innerText = `${weatherDesc} ${temperature}°C @ ${place}`;
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
    getWeather(latitude, longitude);
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
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

function init() {
    loadCoords();
}

init();