let map;
let userLocation;
let taggedSongs = [];

document.getElementById('search-button').addEventListener('click', searchSong);
document.getElementById('tag-song-button').addEventListener('click', tagSong);
document.getElementById('start-listening').addEventListener('click', startListening);

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.createElement('div'), {
                center: userLocation,
                zoom: 15
            });
            getLocationName(userLocation);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

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

function searchSong() {
    const query = document.getElementById('song-search').value;
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: {
            'Authorization': 'Bearer YOUR_SPOTIFY_ACCESS_TOKEN'
        }
    })
    .then(response => response.json())
    .then(data => {
        const results = data.tracks.items;
        const resultsList = document.getElementById('search-results');
        resultsList.innerHTML = '';
        results.forEach(track => {
            const li = document.createElement('li');
            li.innerText = `${track.name} by ${track.artists[0].name}`;
            li.dataset.uri = track.uri;
            li.addEventListener('click', () => selectSong(track));
            resultsList.appendChild(li);
        });
    });
}

function selectSong(track) {
    selectedSong = track;
    document.getElementById('song-search').value = `${track.name} by ${track.artists[0].name}`;
}

function tagSong() {
    if (!selectedSong || !userLocation) return;
    taggedSongs.push({
        song: selectedSong,
        location: userLocation
    });
    alert('Song tagged to location!');
}

function startListening() {
    if (!userLocation) return;
    const nearestSong = findNearestSong(userLocation);
    if (nearestSong) {
        document.getElementById('now-playing').innerText = `Now Playing: ${nearestSong.song.name} by ${nearestSong.song.artists[0].name}`;
        playSong(nearestSong.song.uri);
    } else {
        alert('No songs found within 100 meters. Tag a song!');
    }
}

function findNearestSong(currentLocation) {
    let nearestSong = null;
    let nearestDistance = Infinity;
    taggedSongs.forEach(tagged => {
        const distance = getDistance(currentLocation, tagged.location);
        if (distance < 100 && distance < nearestDistance) {
            nearestSong = tagged;
            nearestDistance = distance;
        }
    });
    return nearestSong;
}

function getDistance(loc1, loc2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = loc1.lat * Math.PI/180;
    const φ2 = loc2.lat * Math.PI/180;
    const Δφ = (loc2.lat-loc1.lat) * Math.PI/180;
    const Δλ = (loc2.lng-loc1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function playSong(uri) {
    // This function would use the Spotify Web Playback SDK to play the song
    // For simplicity, we'll just log the URI here
    console.log('Playing:', uri);
}
