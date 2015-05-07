"use strict";
var map = map || {};
var markers = markers || [];
var polyLines = polyLines || {};
var gpsArray = [
{
	name: "Gps-1",
	type: "buoy",
	lat: 32.199904, lng: -78.783251
},{
	name: "Gps-2",
	type: "buoy",
	lat: 29.6880527498568, lng: -87.802734375
},{
	name: "Gps-3",
	type: "buoy",
	lat: 22.06527806776582, lng: -87.8466796875
},{
	name: "Jury-Boat",
	type: "boat",
	lat: 25.165173368663954, lng: -76.552734375
}];

var iconStyle = {
	"boat": {
		url: "img/motor-boat-min.png",
		position: new google.maps.Point(15, 15)
	},
	"buoy": {
		url:"img/map-marker-20.png",
		position: new google.maps.Point(10, 25)
	}
};

function initStyledMap() {
	var styles = [
	{
		stylers: [
			{ hue: "#00ffe6" },
			{ saturation: -20 }
		]
	},{
		featureType: "road",
		elementType: "geometry",
		stylers: [
			{ lightness: 100 },
			{ visibility: "simplified" }
		]
	},{
		featureType: "road",
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	}];
	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	return new google.maps.StyledMapType(styles, {name: "Dart style Map"});
}

function init() {
	var mapOptions = {
		mapTypeControlOptions: {
			//mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			//mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'map_style']
			//mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'map_style']
			mapTypeIds: [google.maps.MapTypeId.HYBRID, 'map_style']
		}
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map.mapTypes.set('map_style', initStyledMap());
	//map.setMapTypeId('map_style');
	var bounds = zoomControl();
	map.fitBounds(bounds);
	map.panToBounds(bounds);

	// XXX debug
	google.maps.event.addListener(map, "rightclick", function(event) {
		alert("lat: " + event.latLng.lat() + ", lng: " + event.latLng.lng());
	});

	// Initialize Markers
	(function () {
		clearMarkers();
		for (var i = 0; i < gpsArray.length; i++) {
			var lat = gpsArray[i].lat;
			var lng = gpsArray[i].lng;
			//console.log("i: " + i + " Lat: " + lat + "; Long: " + lng); // XXX debug
			addMarker(new google.maps.LatLng(lat, lng), gpsArray[i]);
		}
	}());

	function addMarker(position, elem) {
		var markerIcon = {
			url: iconStyle[elem.type]["url"],
			anchor: iconStyle[elem.type]["position"]
		}
		markers.push(new google.maps.Marker({
			position: position,
			title: elem.name,
			map: map,
			icon: markerIcon,
			animation: google.maps.Animation.DROP
		}));
	}

	function clearMarkers() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}
}

function zoomControl() {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < gpsArray.length; i++) {
		bounds.extend(new google.maps.LatLng(gpsArray[i].lat, gpsArray[i].lng));
	}
	return bounds;
}

function drawLine(lat1, lng1, lat2, lng2, label) {
	if (label in polyLines) {
		polyLines[label].setMap(null);
	}
	var linePath = [
		new google.maps.LatLng(lat1, lng1),
		new google.maps.LatLng(lat2, lng2)
	];

	var line = new google.maps.Polyline({
		path: linePath,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	line.setMap(map);
	polyLines[label] = line;
}

function clearLine(label) {
	if (polyLines[label]) {
		polyLines[label].setMap(null);
	}
}

function clearLines() {
	for (var key in polyLines) {
		polyLines[key].setMap(null);
	}
	polyLines = {};
}

google.maps.event.addDomListener(window, 'load', init);

