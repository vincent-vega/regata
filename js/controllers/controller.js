"use strict";
var myApp = angular.module("regata", []);

myApp.controller('homeController', ['$scope',
                                    '$window',
                                    'contactGroundControl',
                                    '$interval',
                                    '$timeout', function($scope, $window, contactGroundControl, $interval, $timeout) {
	var perimeter = 0,
	    prom,
	    i,
	    endIdx,
	    len,
	    dist,
	    distanceArray;

	$scope.statistics = {};
	$scope.gpsData = {};
	$scope.serviceStatus = null;
	$scope.lastUpdate = null;
	$scope.updateStatistics = function() {
		distanceArray = [];
		for (i = 0, len = dart.gpsArray.length; i < len; i++) {
			endIdx = (i + 1)%dart.gpsArray.length,
			dist = getDistanceFromLatLonInKm(dart.gpsArray[i].lat,
			                                 dart.gpsArray[i].lng,
			                                 dart.gpsArray[endIdx].lat,
			                                 dart.gpsArray[endIdx].lng);
			$scope.gpsData[dart.gpsArray[i].name] = {
				lat: dart.gpsArray[i].lat,
				lng: dart.gpsArray[i].lng
			};
			perimeter += dist;
			distanceArray.push({
				start: dart.gpsArray[i].name,
				end: dart.gpsArray[endIdx].name,
				lenKm: numberWithCommas(dist.toFixed(3)),
				lenM: numberWithCommas((dist*1000).toFixed(2))
			});
		}
		$scope.statistics.perimeterKm = numberWithCommas(perimeter.toFixed(3));
		$scope.statistics.perimeterM = numberWithCommas((perimeter*1000).toFixed(2));
		$scope.statistics.distances = distanceArray;
		$scope.serviceStatus = dart.serviceStatus.code;
		$scope.lastUpdate = dart.serviceStatus.lastUpdateTime;
	}

	$scope.drawPath = function(elem, start, end) {
		if (elem .present === false ) {
			dart.drawLine($scope.gpsData[start].lat, $scope.gpsData[start].lng,
			         $scope.gpsData[end].lat, $scope.gpsData[end].lng,
			         start + end);
			elem.present = true;
		} else {
			dart.clearLine(start + end);
			elem.present = false;
		}
	};
	prom = $interval(function() { contactGroundControl(); $scope.updateStatistics(); }, 10000);
	//$interval.cancel(prom);
	$window.onload = function () {
		contactGroundControl();
		$timeout($scope.updateStatistics, 2000);
	}
}]);

myApp.factory('contactGroundControl', [function() {
	return function() {
		dart.gpsArray = [
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
			}
		];
		var i, len;
		dart.clearMarkers();
		// Initialize Markers
		for (i = 0, len = dart.gpsArray.length; i < len; i++) {
			dart.addMarker(new google.maps.LatLng(dart.gpsArray[i].lat,
			                                      dart.gpsArray[i].lng), dart.gpsArray[i]);
		}
		dart.fitMapZoom();
		dart.serviceStatus.code = "OK";
		dart.serviceStatus.lastUpdateTime = new Date().getTodayDateString();
	};
}]);

