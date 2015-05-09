"use strict";
var myApp = angular.module("regata", []);

myApp.controller('homeController', ['$scope', function($scope) {
	$scope.statistics = {};
	var perimeter = 0,
	    i,
	    endIdx,
	    len,
	    distanceArray = [];
	$scope.gpsData = {};
	for (i = 0; i < gpsArray.length; i++) {
		endIdx = (i + 1)%gpsArray.length,
		len = getDistanceFromLatLonInKm(gpsArray[i].lat,
		                                    gpsArray[i].lng,
		                                    gpsArray[endIdx].lat,
		                                    gpsArray[endIdx].lng);
		$scope.gpsData[gpsArray[i].name] = {
			lat: gpsArray[i].lat,
			lng: gpsArray[i].lng
		};
		perimeter += len;
		distanceArray.push({
			start: gpsArray[i].name,
			end: gpsArray[endIdx].name,
			lenKm: numberWithCommas(len.toFixed(3)),
			lenM: numberWithCommas((len*1000).toFixed(2))
		});
		//console.log("Start: " + gpsArray[i].name +
			    //"; End: " + gpsArray[endIdx].name +
			    //"; Len: " + getGreatCircleDistance(gpsArray[i].lat,
							       //gpsArray[i].lng,
							       //gpsArray[endIdx].lat,
							       //gpsArray[endIdx].lng));
	}
	$scope.statistics.perimeterKm = numberWithCommas(perimeter.toFixed(3));
	$scope.statistics.perimeterM = numberWithCommas((perimeter*1000).toFixed(2));
	$scope.statistics.distances = distanceArray;

	$scope.drawPath = function(elem, start, end) {
		if (elem .present === false ) {
			drawLine($scope.gpsData[start].lat, $scope.gpsData[start].lng,
			         $scope.gpsData[end].lat, $scope.gpsData[end].lng,
			         start + end);
			elem.present = true;
		} else {
			clearLine(start + end);
			elem.present = false;
		}
	};
}]);
