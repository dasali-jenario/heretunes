let map;
let userLocation;

// Initialize the map
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Create a map centered at the user's location
            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 15
            });

            // Add a marker at the user's location
            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location'
            });

            // Get the name of the location
            getLocationName(userLocation);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Get the name of the location using Google Maps Geocoding API
function getLocationName(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
            const locationName = results[0].formatted_address;
            document.getElementById('location-name').innerText = `Location: ${locationName}`;
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
}

// Spotify OAuth flow (from earlier)
const CLIENT_ID = '3a61b1e9521d44d1a5d1b2f7180fe994'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://dasali-jenario.github.io/heretunes/'; // Replace with your GitHub Pages URL

// Check if the user is returning from Spotify authorization
if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
        // Hide login button and show content
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('content').style.display = 'block';

        // Use the access token to make API requests
        console.log('Access Token:', accessToken);
        // You can now use the access token to interact with the Spotify API
    }
}

// Log in with Spotify
document.getElementById('login-button').addEventListener('click', () => {
    const scopes = 'user-read-private user-read-email'; // Add required scopes
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
});
