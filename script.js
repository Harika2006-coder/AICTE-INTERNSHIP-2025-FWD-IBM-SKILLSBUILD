const apiKey = '17ee32a7e8101371512ce7f2a8b5bef7';

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMsg = document.getElementById('errorMsg');
const unitToggle = document.getElementById('unitToggle');
const weatherTip = document.getElementById('weatherTip');

let isFahrenheit = false;

unitToggle.addEventListener('change', () => {
  isFahrenheit = unitToggle.checked;
  if (cityInput.value.trim()) fetchWeather();
});

function getWeatherTip(weatherMain, tempC) {
  weatherMain = weatherMain.toLowerCase();
  if (weatherMain.includes('rain')) return "It's raining 🌧️. Carry an umbrella!";
  if (weatherMain.includes('clear') && tempC > 30) return "It's very sunny ☀️. Drink plenty of water!";
  if (weatherMain.includes('snow')) return "It's snowing ❄️. Wear a warm sweater!";
  if (weatherMain.includes('cloud')) return "Cloudy ☁️. A light jacket might be helpful.";
  if (tempC < 10) return "It's quite cold 🥶. Dress warmly!";
  if (tempC > 25) return "It's warm 🌞. Stay hydrated!";
  if (tempC >= 10 && tempC <= 25)
    if (weatherMain.includes('mist') || weatherMain.includes('fog'))
      return "It's misty 🌫️. Drive safely!";
    if (weatherMain.includes('thunderstorm'))
      if (tempC > 20) return "Thunderstorm ⛈️ expected. Stay indoors if possible!";
      else return "Thunderstorm ⛈️ expected. Stay indoors and stay warm!";
      if (weatherMain.includes('drizzle')) return "Light rain 🌦️. A raincoat might be useful.";
      if (weatherMain.includes('haze'|| 'Haze')) return "Hazy conditions 🌁. Be cautious while driving.";
      if (weatherMain.includes('smoke')) return "Smoky air 🌫️. Limit outdoor activities.";
      if (weatherMain.includes('dust')) return "Dusty conditions 🌪️. Wear a mask if needed.";
      if (weatherMain.includes('sand')) return "Sandy conditions 🌪️. Protect your eyes and skin.";
      if (weatherMain.includes('ash')) return "Volcanic ash 🌋. Avoid outdoor activities.";
      if (weatherMain.includes('squall')) return "Squally weather 🌬️. Secure loose objects outside.";
      if (weatherMain.includes('tornado')) return "Tornado warning 🌪️. Seek shelter immediately!";
      if (weatherMain.includes('fog')) return "Foggy conditions 🌁. Drive carefully.";
      if (weatherMain.includes('hurricane')) return "Hurricane alert 🌀. Follow local safety guidelines.";
  return "Enjoy the weather! 😎";
}

function displayWeather(data) {
  let temp = data.main.temp;
  let feels = data.main.feels_like;
  if (isFahrenheit) {
    temp = (temp * 9/5) + 32;
    feels = (feels * 9/5) + 32;
  }

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  const mainWeather = data.weather[0].main.toLowerCase();

  // Set background image based on weather
  if(mainWeather.includes('cloud')) {
    document.body.style.background = "url('cloudy.jpeg') no-repeat center/cover";
  } else if(mainWeather.includes('rain')) {
    document.body.style.background = "url('rainy.jpeg') no-repeat center/cover";
  } else if(mainWeather.includes('snow')) {
    document.body.style.background = "url('snow.jpeg') no-repeat center/cover";
  } else if(mainWeather.includes('clear')) {
    document.body.style.background = "url('sunny.jpeg') no-repeat center/cover";
  } else if(mainWeather.includes('Haze' || 'haze')) {
    document.body.style.background = "url('Haze.jpeg') no-repeat center/cover";
  } else if(mainWeather.includes('mist')) {
    document.body.style.background = "url('mist.jpeg') no-repeat center/cover";
  } else {
    document.body.style.background = "linear-gradient(135deg, #6b46c1, #b794f4)";
  }

  weatherDisplay.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon"/>
    <p><strong>🌡️Temperature:</strong> ${temp.toFixed(1)} ${isFahrenheit ? '°F' : '°C'}</p>
    <p><strong>🤔Feels Like:</strong> ${feels.toFixed(1)} ${isFahrenheit ? '°F' : '°C'}</p>
    <p><strong>💧Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>🌬️Wind Speed:</strong> ${data.wind.speed} m/s</p>
    <p><strong>❓Condition:</strong> ${data.weather[0].description}</p>
    <p><strong>🌅Sunrise:</strong> ${sunrise}</p>
    <p><strong>🌇Sunset:</strong> ${sunset}</p>
  `;

  weatherTip.textContent = getWeatherTip(data.weather[0].main, data.main.temp);
  errorMsg.textContent = '';
}

function displayError(message) {
  weatherDisplay.innerHTML = '';
  weatherTip.textContent = '';
  errorMsg.textContent = message;
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    displayError('Please enter a city name.');
    return;
  }

  try {
    errorMsg.textContent = '';
    weatherDisplay.innerHTML = 'Loading...';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (data.cod !== 200) {
      displayError(`Error: ${data.message}`);
      return;
    }

    displayWeather(data);
  } catch (error) {
    displayError('Unable to fetch weather data.');
  }
}

getWeatherBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') fetchWeather();
});

window.addEventListener('load', () => {
  cityInput.value = " ";
  fetchWeather();
});