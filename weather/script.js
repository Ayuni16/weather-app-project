const searchBar = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city.section-message');
const notFoundSection = document.querySelector('.not-found.section-message');
const forecastContainer = document.querySelector('.forecast-item-container');

const apiKey = '656c1c362ecc849882901cac0cf82620';

searchBtn.addEventListener('click', handleSearch);
searchBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleSearch();
});

function handleSearch() {
  const city = searchBar.value.trim();
  if (city !== '') {
    fetchWeatherByCity(city);
    searchBar.value = '';
    searchBar.blur();
  }
}

async function fetchWeatherByCity(city) {
  try {
    const current = await getFetchData('weather', city);
    console.log("Current Weather Data:", current);
    const forecast = await getFetchData('forecast', city);
    console.log("Forecast Data:", forecast);
    updateWeatherUI(current);
    updateForecastUI(forecast);
    showDisplaySection(weatherInfoSection);
  } catch (err) {
    console.error(err.message);
    showDisplaySection(notFoundSection);
  }
}

async function getFetchData(type, query) {
  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${query}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return await response.json();
}

function updateWeatherUI(data) {
  document.querySelector('.country-text').textContent = data.name;

  document.querySelector('.current-date-text').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });

  document.querySelector('.temp-txt').textContent = `${Math.round(data.main.temp)} °C`;
  document.querySelector('.condition-txt').textContent = data.weather[0].main;
  document.querySelector('.humidity-value-txt').textContent = `${data.main.humidity}%`;
  document.querySelector('.wind-value-txt').textContent = `${data.wind.speed} m/s`;

  document.querySelector('.weather-summary-img').src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}


function updateForecastUI(data) {
  forecastContainer.innerHTML = '';
  let forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  if (forecastList.length === 0) forecastList = data.list.slice(0, 5);

  forecastList.slice(0, 5).forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const temp = `${Math.round(item.main.temp)} °C`;

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h5 class="forecast-item-date regular-txt">${day}</h5>
      <img src="${iconUrl}" alt="" class="forecast-item-img" />
      <h5 class="forecast-item-temp">${temp}</h5>
    `;
    forecastContainer.appendChild(forecastItem);
  });
}

function showDisplaySection(sectionToShow) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    section => section.style.display = 'none'
  );
  sectionToShow.style.display = 'flex';
}

// ✅ Show search city section first on load
window.addEventListener('load', () => {
  showDisplaySection(searchCitySection);
});
