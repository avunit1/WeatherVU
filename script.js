// Function to fetch JSON data from a given URL
function json(url) {
    return fetch(url).then(res => res.json());
}

// Function to get the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeather, handleGeoError);
    } else {
        fallbackToIP(); // Fallback if geolocation is not supported
    }
}

// Function to handle geolocation errors
function handleGeoError(error) {
    // No alert or message for user denial
    if (error.code === error.PERMISSION_DENIED) {
        fallbackToIP(); // If permission denied, fall back to IP location
    }
}

// Fallback function to get location from IP
function fallbackToIP() {
    const apiKey = '7be470b31fbc094b61a96511b09972fda4a5e508f3c07377ee67f467'; // Your IPData API key
    json(`https://api.ipdata.co?api-key=${apiKey}`)
        .then(data => {
            const lat = data.latitude;
            const lon = data.longitude;

            // Log the IP-based location
            console.log(`IP-based Latitude: ${lat}`);
            console.log(`IP-based Longitude: ${lon}`);

            // Use the IP-based location to fetch weather data
            fetchWeather({ coords: { latitude: lat, longitude: lon } });
        })
        .catch(error => {
            console.error('Error fetching IP-based location:', error);
        });
}

// Function to fetch weather data from Open-Meteo API
function fetchWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Log latitude and longitude to the console
    console.log(`Detected Latitude: ${lat}`);
    console.log(`Detected Longitude: ${lon}`);

    // Fetch the weather data (including precipitation)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherData(data);

            // Extract temperature from current weather
            const temp = data.current_weather.temperature; // Get temperature from API response
            const humidity = data.hourly.relative_humidity_2m[0];
            const windSpeed = data.current_weather.windspeed;
            const precipitation = data.hourly.precipitation[0]; // Precipitation chance

            // Log temperature, humidity, wind speed, and precipitation to the console
            console.log(`Current Temperature: ${temp}°C`);
            console.log(`Current Humidity: ${humidity}%`);
            console.log(`Current Wind Speed: ${windSpeed} m/s`);
            console.log(`Chance of Precipitation: ${precipitation} mm`);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


// Function to update the UI with weather data
function updateWeatherData(data) {
    const currentWeather = data.current_weather;
    const hourly = data.hourly;

    // Temperature (current temperature from current_weather)
    const temp = currentWeather.temperature;
    document.getElementById('temperature').innerHTML = `<h2>Temperature</h2><p>${temp}°C</p>`;

    // Precipitation (chance of rain from hourly data)
    const precipitation = hourly.precipitation[0];
    document.getElementById('precipitation').innerHTML = `<h2>Precipitation</h2><p>${precipitation} mm</p>`;

    // Wind Speed (from current weather)
    const windSpeed = currentWeather.windspeed;
    document.getElementById('wind').innerHTML = `<h2>Wind Speed</h2><p>${windSpeed} m/s</p>`;

    // Humidity (current value from hourly data)
    const humidity = hourly.relative_humidity_2m[0];
    document.getElementById('humidity').innerHTML = `<h2>Humidity</h2><p>${humidity}%</p>`;

    // Show the container and hide loading when data is fetched
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';
}

// Call the getLocation function when the page loads
window.onload = getLocation;
