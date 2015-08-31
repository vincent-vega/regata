"use strict";
var myApp = angular.module("regata", []);

myApp.controller('HomeController', ['$scope',
                                    '$window',
                                    'contactGroundControl',
                                    '$interval',
                                    '$timeout', function($scope, $window, contactGroundControl, $interval, $timeout) {
	var perimeter,
	    i,
	    endIdx,
	    len,
	    dist,
	    distanceArray;

	$scope.statistics = {};
	$scope.gpsData = {};
	$scope.serviceStatus = null;
	$scope.lastUpdate = null;
	$scope.intervalValue = 60; // seconds
	$scope.updateStatistics = function() {
		perimeter = 0;
		distanceArray = [];
		for (i = 0, len = dart.gpsArray.length; i < len; i++) {
			endIdx = (i + 1)%dart.gpsArray.length,
			dist = google.maps.geometry.spherical.computeDistanceBetween(dart.gpsArray[i].coord, dart.gpsArray[endIdx].coord);
			$scope.gpsData[dart.gpsArray[i].name] = {
				lat: dart.gpsArray[i].coord.lat(),
				lng: dart.gpsArray[i].coord.lng()
			};
			perimeter += dist;
			distanceArray.push({
				start: dart.gpsArray[i].name,
				end: dart.gpsArray[endIdx].name,
				lenKm: numberWithCommas((dist/1000).toFixed(2)),
				lenM: numberWithCommas(dist.toFixed(2))
			});
		}
		$scope.statistics.perimeterKm = numberWithCommas((perimeter/1000).toFixed(3));
		$scope.statistics.perimeterM = numberWithCommas(perimeter.toFixed(2));
		$scope.statistics.distances = distanceArray;
		$scope.serviceStatus = dart.serviceStatus.code;
		$scope.lastUpdate = dart.serviceStatus.lastUpdateTime;
	}

	$scope.drawPath = function($event, elem, start, end) {
		if ($event.currentTarget.style.backgroundColor === "") {
			$event.currentTarget.style.backgroundColor = "#99ccff";
		} else {
			$event.currentTarget.style.backgroundColor = "";
		}
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

	$scope.resync = function() { contactGroundControl(); $scope.updateStatistics(); };

	//$scope.prom = $interval(function() { contactGroundControl(); $scope.updateStatistics(); }, $scope.intervalValue*1000);

	$scope.updateProm = function(v) {
		if (v === "up") {
			//intervalValue < 100 && (intervalValue = intervalValue + 5) || intervalValue
			$scope.intervalValue = $scope.intervalValue < 100 ? $scope.intervalValue + 5 : $scope.intervalValue;
		} else if (v === "down") {
			//intervalValue > 0 && (intervalValue = intervalValue - 5) || intervalValue
			$scope.intervalValue = $scope.intervalValue > 0 ? $scope.intervalValue - 5 : $scope.intervalValue;
		}
		$interval.cancel($scope.prom);
		$scope.prom = $interval(function() { contactGroundControl(); $scope.updateStatistics(); }, $scope.intervalValue*1000);
	}

	$window.onload = function () {
		contactGroundControl();
		$timeout($scope.updateStatistics, 2000);
	}
}]);

myApp.factory('contactGroundControl', [function() {
	return function() {
		dart.gpsArray = [{
				name: "Gps-1",
				type: "buoy",
				//lat: 42.871938424448466, lng: 10.163726806640625
				coord: new google.maps.LatLng(42.871938424448466, 10.163726806640625)
			},{
				name: "Gps-2",
				type: "buoy",
				//lat: 42.89105805581562, lng: 10.4974365234375
				coord: new google.maps.LatLng(42.89105805581562, 10.4974365234375)
			},{
				name: "Gps-3",
				type: "buoy",
				//lat: 42.696567309696974, lng: 10.507049560546875
				coord: new google.maps.LatLng(42.696567309696974, 10.507049560546875)
			},{
				name: "Jury-Boat",
				type: "boat",
				//lat: 42.685463935766094, lng: 10.007171630859375
				coord: new google.maps.LatLng(42.685463935766094, 10.007171630859375)
		}];
		var i, len;
		dart.clearMarkers();
		dart.clearLines();
		// Initialize Markers
		for (i = 0, len = dart.gpsArray.length; i < len; i++) {
			dart.addMarker(dart.gpsArray[i].coord, dart.gpsArray[i].name, dart.gpsArray[i].type);
		}
		dart.fitMapZoom();
		dart.serviceStatus.code = "OK";
		dart.serviceStatus.lastUpdateTime = new Date();
	};
}]);

