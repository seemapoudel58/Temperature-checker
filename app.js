const apiKey = '81b27c269d3735d7f9e7b6c7283dfea9';

const searchButton = document.querySelector('.search-btn');
const cityInput = document.querySelector('.city-input');
const weatherCardsDiv = document.querySelector('.weather-cards');
const currentWeatherDiv = document.querySelector('.current-weather');
const locationButton = document.querySelector('.location-btn');

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details">
                <h2>${cityName}(${weatherItem.dt_txt.split(' ')[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
                  2
                )}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>               
            </div>
            <div class="icon">
                <img
                src="https://openweathermap.org/img/wn/${
                  weatherItem.weather[0].icon
                }@4x.png"
                alt="weather icon"
                />
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
  } else {
    return `<li class="card">
                  <h3>(${weatherItem.dt_txt.split(' ')[0]})</h3>
                  <img
                  src="https://openweathermap.org/img/wn/${
                    weatherItem.weather[0].icon
                  }@2x.png"
                  alt="weather icon"
                  />
                  <h4>Temp:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                  <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                  <h4>Humidity: ${weatherItem.main.humidity}%</h4>
              </li>`;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      cityInput.value = '';
      weatherCardsDiv.innerHTML = '';
      currentWeatherDiv.innerHTML = '';

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            'beforeend',
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            'beforeend',
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })

    .catch(() => {
      alert('An error occurred while fetching the weather forecast!');
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
      //   console.log(data);
    })
    .catch(() => {
      alert('An error occurred while fetching the coordinates!');
    });
  // const fetchData = async () => {
  //     try {
  //       const response = await fetch(GEOCODING_API_URL);

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error('An error occurred while fetching the coordinates:', error);
  //     }
  //   };

  //   fetchData();
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
          //   console.log(data);
        })
        .catch(() => {
          alert('An error occurred while fetching the city!');
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          'Geolocation request denied. Please reset location permission to grant access again.'
        );
      }
    }
  );
};

searchButton.addEventListener('click', getCityCoordinates);
locationButton.addEventListener('click', getUserCoordinates);
