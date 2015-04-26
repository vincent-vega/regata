"use strict";
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);
	var dLon = deg2rad(lon2-lon1);
	var a =
		Math.sin(dLat/2)*Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
		Math.sin(dLon/2)*Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c; // Distance in km
}

function getGreatCircleDistance(lat1, lon1, lat2, lon2) {
	// d=2*asin(sqrt((sin((lat1-lat2)/2))^2 + cos(lat1)*cos(lat2)*(sin((lon1-lon2)/2))^2))
	var dLat = deg2rad(lat1 - lat2);
	var dLon = deg2rad(lon1 - lon2);
	return 2*Math.asin(Math.sqrt(Math.pow((Math.sin(dLat/2), 2) + 
	Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.pow(Math.sin(dLon/2), 2))));
}

function deg2rad(deg) {
  return deg*(Math.PI/180)
}

function numberWithCommas(x) {
	var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
    //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
