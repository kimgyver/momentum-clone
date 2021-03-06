const API_KEY = 'db924aa1722406eb1fb28407c06cf5a0';
const COORDS = 'coords';

const weather = document.querySelector('.js-weather');
const weatherForecast = document.querySelector('.js-weather-forecast');

const weatherImage = {
  'clear sky': 's',
  'few clouds': '10c',
  'scattered clouds': '30c',
  'broken clouds': '60c',
  'overcast clouds': '100c',
  'light rain': '50r',
  'moderate rain': 'r',
  'shower rain': 'sh',
  'heavy intensity rain': 'hr',
};

function getWeatherImage(desc) {
  const svg = weatherImage[desc];
  if (svg == null) {
    // return desc;
    return '';
  }
  const imageTag = `<img src='./weather-svg/${svg}.svg' width=23 height=23>`;
  return imageTag;
}

function date2string(date, showDate, showTime) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  let text = '';
  if (showDate) {
    text += `${day < 10 ? `0${day}` : day}/${
      month < 10 ? `0${month}` : month
    }/${year} `;
  }

  if (showTime) {
    text += `${hours < 10 ? `0${hours}` : hours}H`;
  }

  return text;
}

function getWeatherForecast(lat, lng) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      // console.log(json);

      let text = "<div class='weather'>";
      let prevDate = '';
      let hourGap = 0;
      if (lng > 124 && lng < 130) {
        hourGap = 9; // Korea
      } else if (lng > 170 && lng < 180) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        if (currentMonth >= 10 || currentMonth <= 3) {
          hourGap = 13; // NZ
        } else {
          hourGap = 12; // NZ
        }
      } else if (lng > 117 && lng < 123) {
        hourGap = 8; // Philippins
      }

      json.list.forEach(function (element, i) {
        if (i > 23) {
          return;
        }
        //const date = new Date(element.dt_txt);
        var a = element.dt_txt.split(/[^0-9]/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);

        let changedDate = new Date();
        changedDate.setTime(date.getTime() + hourGap * 60 * 60000); // GMT+hourGap
        if (changedDate.getDate() !== prevDate) {
          if (i != 0) {
            text += '</div>';
          }
          const yearmonthday = date2string(changedDate, true, false);
          text += `<div class='day'><div class='day-display'>${yearmonthday}</div>`;
        }
        const datetime = date2string(changedDate, false, true);
        prevDate = changedDate.getDate();
        const weatherDesc =
          getWeatherImage(element.weather[0].description) +
          element.weather[0].description;
        const temperature = parseFloat(element.main.temp).toFixed(1); // precision change
        text += `<div class='time-weather'>${datetime} ${temperature}°C ${weatherDesc} </div>`;
      });
      text += '</div>'; // end of wether
      weatherForecast.innerHTML = text;
    });
}

function getCurrentWeather(lat, lng) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      //console.log(json);
      const weatherDesc =
        getWeatherImage(json.weather[0].description) +
        json.weather[0].description;
      const temperature = json.main.temp;
      const place = json.name;
      weather.innerHTML = `<div style="font-size: 1.2rem">${weatherDesc} ${temperature}°C @ ${place}</div>`;
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
    longitude,
  };
  saveCoords(coodsObj);
  getCurrentWeather(latitude, longitude);
  getWeatherForecast(latitude, longitude);
}

function handleGeoError() {
  console.log("Can't access geo location");
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoordsAndWeather() {
  const loadedCoords = localStorage.getItem(COORDS);
  console.log('loadCoordsAndWeather()', loadedCoords);
  if (loadedCoords === null) {
    weatherForecast.innerHTML =
      'Please turn GPS on to know your location.<br>(Required only once)';
    askForCoords();
  } else {
    const parsedCoords = JSON.parse(loadedCoords);
    getCurrentWeather(parsedCoords.latitude, parsedCoords.longitude);
    getWeatherForecast(parsedCoords.latitude, parsedCoords.longitude);
  }
}

function init() {
  loadCoordsAndWeather();
}

init();

setInterval(function () {
  if (localStorage.getItem('auto-refresh') === 'true') {
    init();
  }
}, 1200000);
