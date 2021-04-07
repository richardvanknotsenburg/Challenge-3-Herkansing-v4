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

// Marker voor Friesland, Bantega
var popup = new mapboxgl.Popup().setHTML('<h3 class="noted">Secret Landing spot. Property of SpaceX. Code: 23-1423-BAI</h3>');
var marker = new mapboxgl.Marker({ color: '#000000'})

.setLngLat([5.812432, 52.849904])
.setPopup(popup)
.addTo(map);

var searchbar = document.querySelector('.mapboxgl-ctrl-geocoder--input');
searchbar.addEventListener('change', getSearchResult);

//voor het veranderen van de map in andere kleurtjes.
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
 
function switchLayer(layer) {
var layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
}
 
for (var i = 0; i < inputs.length; i++) {
inputs[i].onclick = switchLayer;
}


//Variabelen voor de functie getSearchResults
var searchTerm;
var searchCountry;

// In deze functie sla ik de data op en maak ik er een array van. Ik heb met dit stuk echt veel gekloot. Op het internet veel over gevonden. Het geeft in de console nog steeds een error, maar in principe werkt het gewoon. De error komt alleen als je iets anders dan een land in de zoekbalk intikt. Dit heeft te maken met dat de andere API alleen maar land-info weergeeft. Als je dus bijv. een adres of stad intikt krijg je een error, terwijl hij erna wel direct herkent om welk land het gaat & dus werkt het.
function getSearchResult(e) {
    searchTerm = e.target.value;
    var searchArray = searchTerm.split(', ');
    searchCountry = searchArray[searchArray.length - 1];
    getAPIdata();
}

// Met deze functie haal ik de data op uit de tweede API en plaats ik deze in de html
function getAPIdata() {
    // Dit is de standaard input: Zweden. Omdat ik wil dat de voorkeurs-landingsplek Zweden wel blijft bestaan. 
    var country = searchCountry ? searchCountry : 'Netherlands';
	// construct request. Met ${} kan je met de input de link veranderen. Dit is een kortere manier dan te werken met een optelsom van stukjes link code. Gevonden op internet hoe het moet en werkt super chill :)
	var request = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;

	// get current country
	fetch(request)	
	
	// parse response to JSON format
	.then(function(response) {
		return response.json();
	})
	
	// do something with response
	.then(function(response) {
        // Verander de html tekst naar de landnaam
        var country = document.getElementById('country').innerHTML = response[0].name;
        // verander de html tekst naar de gesproken taal
        var language = document.getElementById('language').innerHTML = response[0].languages[0].name;
	});
}

// init data stream
getAPIdata();

map.on('load', function () {
    map.resize();
});
