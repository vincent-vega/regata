"use strict";
function Dart() {
	this.map = {};
	this.markers = [];
	this.polyLines = {};
	this.gpsArray = [];
	this.serviceStatus = {
		code: null,
		lastUpdateTime: null
	};
	this.iconStyle = {
		"boat": {
			url: "img/motor-boat-min.png",
			position: new google.maps.Point(15, 15)
		},
		"buoy": {
			url: "img/map-marker-20.png",
			position: new google.maps.Point(10, 25)
		}
	};
}

Dart.prototype.fitMapZoom = function() {
	var bounds = new google.maps.LatLngBounds(),
		i,
		len = this.gpsArray.length;
	for (i = 0; i < len; i++) {
		bounds.extend(new google.maps.LatLng(this.gpsArray[i].lat,
		                                     this.gpsArray[i].lng));
	}
	if (len > 0) {
		this.map.fitBounds(bounds);
		this.map.panToBounds(bounds);
	}
};

Dart.prototype.addMarker = function(position, elem) {
	var markerIcon = {
		url: this.iconStyle[elem.type]["url"],
		anchor: this.iconStyle[elem.type]["position"]
	}
	this.markers.push(new google.maps.Marker({
		position: position,
		title: elem.name,
		map: this.map,
		icon: markerIcon,
		animation: google.maps.Animation.DROP
	}));
};

Dart.prototype.clearMarkers = function() {
	for (var i = 0, len = this.markers.length; i < len; i++) {
		this.markers[i].setMap(null);
	}
	this.markers = [];
};

Dart.prototype.clearLines = function() {
	for (var key in this.polyLines) {
		this.polyLines[key].setMap(null);
	}
	this.polyLines = {};
};

Dart.prototype.drawLine = function(lat1, lng1, lat2, lng2, label) {
	if (label in this.polyLines) {
		this.polyLines[label].setMap(null);
	}
	var line = new google.maps.Polyline({
		path: [
			new google.maps.LatLng(lat1, lng1),
			new google.maps.LatLng(lat2, lng2)
		],
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	line.setMap(this.map);
	this.polyLines[label] = line;
};

Dart.prototype.clearLine = function(label) {
	if (this.polyLines[label]) {
		this.polyLines[label].setMap(null);
	}
};

var dart = dart || new Dart();

function init() {
	function initStyledMap() {
		var styles = [{
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

	var mapOptions = {
		center: { lat: 44.01148674722159, lng: 10.102918446063995 },
		zoom: 12,
		mapTypeControlOptions: {
			//mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			//mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'map_style']
			//mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'map_style']
			mapTypeIds: [google.maps.MapTypeId.HYBRID, 'map_style']
		}
	};
	dart.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	dart.map.mapTypes.set('map_style', initStyledMap());
	//dart.map.setMapTypeId('map_style');

	// XXX debug
	google.maps.event.addListener(dart.map, "rightclick", function(event) {
		alert("lat: " + event.latLng.lat() + ", lng: " + event.latLng.lng());
	});
}

google.maps.event.addDomListener(window, 'load', init);

