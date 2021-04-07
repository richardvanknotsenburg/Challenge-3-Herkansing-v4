//Dit gebruik je om de map op te halen
mapboxgl.accessToken = 'pk.eyJ1IjoiZXp6b2x0amUiLCJhIjoiY2tta2w4N3ptMTI0NTMxczFuYWs5NW5nZiJ9.vwpixDi8jqXmSacGr5gIJQ'; //mijn persoonlijke api code van mapbox
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v10', //Voor die darkmode
center: [5.812432, 52.849904], // positie van Bantega, Friesland. Omdat het lekker remote is
zoom: 7
});

// De api van Restcountries moet engels zijn, dus vandaar de specificering voor de engelse taal in de zoekbalk
//Geocoder komt vanuit de les
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: 'en-GB', //voor de engelse taal.
    mapboxgl: mapboxgl
    });

    map.addControl(geocoder);

// Controls voor de map
map.addControl(new mapboxgl.NavigationControl());

// Coole flyTo animatie vanuit de les die ik wel geinig vond :p
map.flyTo({
center: [5.812432, 52.849904],
zoom: 13,
speed: 1.5,
curve: 1,
easing(t){
return t;
}
});

// Marker voor Friesland, Bantega. In de les behandeld
var popup = new mapboxgl.Popup().setHTML('<h3 class="noted">Secret Landing spot. Property of SpaceX. Code: 23-1423-BAI</h3>');
var marker = new mapboxgl.Marker({ color: '#000000'})

.setLngLat([5.812432, 52.849904])
.setPopup(popup)
.addTo(map);

var searchbar = document.querySelector('.mapboxgl-ctrl-geocoder--input');
searchbar.addEventListener('change', getSearchResult);

//Ik denk niet dat dit meetelt als zijnde  nieuwe api, maar ik vond het toch de moeite waard om erbij te doen, omdat het de look en feel van het dashboard versterkt. Wel zo handig bij 30+ passagiers.
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
 
function switchLayer(layer) {
var layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
}
 
for (var i = 0; i < inputs.length; i++) {
inputs[i].onclick = switchLayer;
}

var searchTerm;
var searchCountry;

function getSearchResult(e) {
    searchTerm = e.target.value; //The target property of the Event interface is a reference to the object onto which the event was dispatched.
    var searchArray = searchTerm.split(', ');//The split() method is used to split a string into an array of substrings, and returns the new array.
    searchCountry = searchArray[searchArray.length - 1];
    getAPIdata();
}

// Deze functie hebben we in de les behandeld en heb ik dan ook gebruikt.
function getAPIdata() {
    
    var country = searchCountry ? searchCountry : 'Netherlands'; //Dit kleine stukje code heb ik van een klasgenoot, omdat ik hier helemaal op vast liep.
	// construct request. ${ } gebruik ik op twitch.tv altijd om commands te creëren als er een variabel aangeroepen moet worden (ik bedoel iets dat veranderd) zoals een username.
	var request = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;

	// get current country
	fetch(request)	
	
	// parse response to JSON format
	.then(function(response) {
		return response.json();
	})
	
	// do something with response
	.then(function(response) {
        var country = document.getElementById('country').innerHTML = response[0].name;
        var language = document.getElementById('language').innerHTML = response[0].languages[0].name;
	});
}

getAPIdata();

//nu kan de map daadwerkelijk geladen worden, tip van Fedor :D
map.on('load', function () {
    map.resize();
});
