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
			position: new google.maps.Point(10, 27)
		}
	};
}

Dart.prototype.fitMapZoom = function() {
	var bounds = new google.maps.LatLngBounds(),
		i,
		len = this.gpsArray.length;
	for (i = 0; i < len; i++) {
		bounds.extend(this.gpsArray[i].coord);
	}
	if (len > 0) {
		this.map.fitBounds(bounds);
		this.map.panToBounds(bounds);
	}
};

Dart.prototype.addMarker = function(position, name, type) {
	var markerIcon = {
		url: this.iconStyle[type]["url"],
		anchor: this.iconStyle[type]["position"]
	}
	this.markers.push(new google.maps.Marker({
		position: position,
		title: name,
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
	var key,
	    i,
	    array,
	    arcPts, polyTest,
	    spherical = google.maps.geometry.spherical,
	    point1 = new google.maps.LatLng(lat1, lng1),
	    point2 = new google.maps.LatLng(lat2, lng2),
	    center,
	    radius,
	    line = new google.maps.Polyline({
	        path: [
	            point1,
	            point2
	        ],
	        geodesic: true,
	        strokeColor: '#FF0000',
	        strokeOpacity: 1.0,
	        strokeWeight: 3
	    });

	line.setMap(this.map);
	for (key in this.polyLines) {
		array = this.polyLines[key].getPath().getArray();
		for (i = 0; i < array.length; i++) {
			if (array[i].equals(point1)) {
				center = point1;
			} else if (array[i].equals(point2)) {
				center = point2;
			} else {
				continue;
			}
			radius = spherical.computeDistanceBetween(point1, point2);
			if (radius > spherical.computeDistanceBetween(array[1], array[0])) {
				radius = spherical.computeDistanceBetween(array[1], array[0]);
			}
			radius = radius/3;
			arcPts = this.getArcPts(center,
			                        spherical.computeHeading(point1, point2),
			                        spherical.computeHeading(array[1], array[0]),
			                        radius);
			polyTest = new google.maps.Polyline({ path: arcPts,
			                                      geodesic: false,
			                                      strokeColor: '#FF0000',
			                                      strokeOpacity: 2,
			                                      strokeWeight: 0.8 });
			polyTest.setMap(this.map);
		/*
			piePoly = new google.maps.Polygon({ paths: [arcPts],
			                                    strokeColor: "#00FF00",
			                                    strokeOpacity: 0.5,
			                                    strokeWeight: 2,
			                                    fillColor: "#FF0000",
			                                    fillOpacity: 0.35,
			                                    map: this.map });
		*/
		}
	}
	this.polyLines[label] = line;
};

Dart.prototype.getArcPts = function(center, initialBearing, finalBearing, radius, inner) {
	var pointNum,
	    //rlat = (radius / EarthRadiusMeters) * r2d, // XXX find the raidus in lat/lon ???
	    //rlng = rlat / Math.cos(center.lat() * d2r), // XXX ???
	    deltaBearing,
	    i,
	    extp = new Array();

	inner = typeof inner !== 'undefined' ? inner : true;
	if (finalBearing < 0) {
		finalBearing += 360;
	}
	if (initialBearing < 0) {
		initialBearing += 360;
	}
	deltaBearing = Math.abs(finalBearing - initialBearing);
	pointNum = Math.floor(deltaBearing/2.5);
	if (pointNum%2 == false) {
		pointNum++;
	}
	console.log("delta: " + deltaBearing);
	console.log("initial: " + initialBearing);
	console.log("final: " + finalBearing);
	console.log("points number: " + pointNum);
	deltaBearing = deltaBearing/pointNum;
	for (i = 0; i < pointNum; i++) {
		extp.push(center.ComputeDestinationPoint(initialBearing + i*deltaBearing, radius));
		//bounds.extend(extp[extp.length-1]); // XXX fit map???
	}
	return extp;
}

Dart.prototype.clearLine = function(label) {
	if (this.polyLines[label]) {
		this.polyLines[label].setMap(null);
		delete this.polyLines[label];
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
		center: { lat: 44.01148674722159, lng: 10.102918446063995 }, // XXX needed???
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
		alert("coord: new google.maps.LatLng(" + event.latLng.lat() + ", " + event.latLng.lng() + ")");
	});
}

google.maps.event.addDomListener(window, 'load', init);

google.maps.LatLng.prototype.ComputeDestinationPoint = function(bearing, dist) {
	// this = arc center (google.maps.LatLng object)
	var R = 6378137.0, // earth's mean radius in meters
	    d2r = Math.PI/180,
	    r2d = 180/Math.PI,
	    brng = bearing*d2r,
	    lat1 = this.lat()*d2r,
	    lon1 = this.lng()*d2r,
	    lat2 = Math.asin(Math.sin(lat1)*Math.cos(dist/R) + Math.cos(lat1)*Math.sin(dist/R)*Math.cos(brng)),
	    lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist/R)*Math.cos(lat1), Math.cos(dist/R)-Math.sin(lat1)*Math.sin(lat2));

	return new google.maps.LatLng(lat2*r2d, lon2*r2d);
}

// === A function which returns the bearing between two LatLng in radians ===
// === If v1 is null, it returns the bearing between the first and last vertex ===
// === If v1 is present but v2 is null, returns the bearing from v1 to the next vertex ===
// === If either vertex is out of range, returns void ===
//google.maps.LatLng.prototype.Bearing = function(otherLatLng) {
  //var from = this;
  //var to = otherLatLng;
  //if (from.equals(to)) {
    //return 0;
  //}
  //var lat1 = from.latRadians();
  //var lon1 = from.lngRadians();
  //var lat2 = to.latRadians();
  //var lon2 = to.lngRadians();
  //var angle = - Math.atan2( Math.sin( lon1 - lon2 ) * Math.cos( lat2 ), Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon1 - lon2 ) );
  //if ( angle < 0.0 ) angle  += Math.PI * 2.0;
  //if ( angle > Math.PI ) angle -= Math.PI * 2.0;
  //return parseFloat(angle.toDeg());
//}

/**
 * Normalize a heading in degrees to between 0 and +360
 *
 * @return {Number} Return
 * @ignore
 */
//Number.prototype.toBrng = function() {
  //return (this.toDeg() + 360) % 360;
//};
