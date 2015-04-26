"use strict";
var myApp = angular.module("regata", []);

myApp.controller('homeController', ['$scope', function($scope) {
	$scope.statistics = {};
	var perimeter = 0;
	var distanceArray = [];
	for (var i = 0; i < gpsArray.length; i++) {
		var endIdx = (i + 1)%gpsArray.length;
		var len = getDistanceFromLatLonInKm(gpsArray[i].lat,
		                                    gpsArray[i].lng,
		                                    gpsArray[endIdx].lat,
		                                    gpsArray[endIdx].lng);
		perimeter += len;
		distanceArray.push({
			start: gpsArray[i].name,
			end: gpsArray[endIdx].name,
			lenKm: numberWithCommas(len.toFixed(3)),
			lenM: numberWithCommas((len*1000).toFixed(2))
		});
		console.log("Start: " + gpsArray[i].name +
		            "; End: " + gpsArray[endIdx].name +
		            "; Len: " + getGreatCircleDistance(gpsArray[i].lat,
		                                               gpsArray[i].lng,
		                                               gpsArray[endIdx].lat,
		                                               gpsArray[endIdx].lng));
	}
	$scope.statistics.perimeterKm = numberWithCommas(perimeter.toFixed(3));
	$scope.statistics.perimeterM = numberWithCommas((perimeter*1000).toFixed(2));
	$scope.statistics.distances = distanceArray;
}]);

