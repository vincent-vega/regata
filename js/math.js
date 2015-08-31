"use strict";
/**
 * Manual computation disabled, using google maps geometry library
 *

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371, // Radius of the earth in km
	    dLat = deg2rad(lat2-lat1),
	    dLon = deg2rad(lon2-lon1),
	    a = Math.sin(dLat/2)*Math.sin(dLat/2) +
	        Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
	        Math.sin(dLon/2)*Math.sin(dLon/2),
	    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c; // Distance in km
}

function deg2rad(deg) {
	return deg*(Math.PI/180)
}
*/

function numberWithCommas(x) {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
	//return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBearings(points) {
	// `points': array of google.maps.LatLng objects
	var spherical = google.maps.geometry.spherical,
	    // point1 = markers[0].getPosition(),
	    // point2 = markers[1].getPosition(),
	    // point3 = markers[2].getPosition(),
	    bearing1 = spherical.computeHeading(points[0],points[1]),
	    bearing2 = spherical.computeHeading(points[1],points[2]);
	return getDifference(bearing1, bearing2); // angle
}

function getDifference(a1, a2) {
	a1 = a1 > 0 ? a1 : 360 + a1;
	a2 = a2 > 0 ? a2 : 360 + a2;
	var angle = Math.abs(a1 - a2) + 180;
	if (angle > 180){
		angle = 360 - angle;
	}
	return Math.abs(angle);
}

