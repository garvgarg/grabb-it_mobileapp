angular.module('grabbit')
    .controller('ScanDetailsCtrl', function ($scope, $rootScope, $ionicPopup, grabbitService, couponDetail, LocalDataSetup) {
        console.log("***** Inside Current Scan DealsDetailCtrl *****")
        // $scope.coupon = {};
        $scope.localSetCouponScan = [];
        $scope.doRefresh = function () {
            // console.log('Refreshing!');
            setTimeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 500);
        };
        $scope.onloadData = function () {
            $scope.coupon = couponDetail.getCoupon().coupon;
        }
        $scope.onloadData();
        $scope.coupon = couponDetail.getCoupon().coupon;
        // console.log(couponScanDetail.getScanCoupon())
        // for showing the location in map
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        // for google map
        function initMap() {
            map = new google.maps.Map(document.getElementById('scanMap'), {
                center: { lat: parseFloat($scope.coupon.business_latitude), lng: parseFloat($scope.coupon.business_longitude) },
                zoom: 12
            });
            infoWindow = new google.maps.InfoWindow;

            var pos = {
                lat: parseFloat($scope.coupon.business_latitude),
                lng: parseFloat($scope.coupon.business_longitude)
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            infoWindow.setPosition(pos);
            infoWindow.setContent($scope.coupon.business_address);
            // infoWindow.open(map, marker);
            map.setCenter(pos);
            directionsDisplay.setMap(map);
            drowRoutePath();
        }
        // for drowing the path
        function drowRoutePath() {
            if (navigator.geolocation) {
                var params = {};
                //Calling latitude and longitude of user location
                navigator.geolocation.getCurrentPosition(function (position) {
                    // console.log("**************", position);
                    $scope.position = position;
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    params.lat = $scope.latitude;
                    params.lng = $scope.longitude;
                    var start = new google.maps.LatLng($scope.latitude, $scope.longitude);
                    var end = new google.maps.LatLng($scope.coupon.business_latitude, $scope.coupon.business_longitude);
                    // var start = new google.maps.LatLng(37.329660, -121.889780);
                    // var end = new google.maps.LatLng(15.471879, 73.855591);

                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend(start);
                    bounds.extend(end);
                    map.fitBounds(bounds);
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: google.maps.TravelMode.DRIVING
                    };

                    directionsService.route(request, function (response, status) {

                        if (status == google.maps.DirectionsStatus.OK) {

                            directionsDisplay.setDirections(response);
                            directionsDisplay.setMap(map);
                        } else {
                            $ionicPopup.alert({title:'FAILED',template:'Directions Request from'+ start.toUrlValue(6) + ' to ' + end.toUrlValue(6) + ' failed: ' + status});
                        }
                    });
                })

            } else {
                // var start = new google.maps.LatLng(15.312996, 75.130005);            
                // var end = new google.maps.LatLng(15.471879, 73.855591);
                var start = new google.maps.LatLng(37.329660, -121.889780);
                var end = new google.maps.LatLng($scope.coupon.business_latitude, $scope.coupon.business_longitude);

                var bounds = new google.maps.LatLngBounds();
                bounds.extend(start);
                bounds.extend(end);
                map.fitBounds(bounds);
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, function (response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap(map);
                    } else {
                        $ionicPopup.alert({title:'FAILED',template:'Directions Request from'+ start.toUrlValue(6) + ' to ' + end.toUrlValue(6) + ' failed: ' + status});                        
                    }
                });
            }

        }
        // for callback function for alert
        function callback(b){
            if(b){
                // console.log('say ok');
            }else{
                // console.log('say awesome');
            }
        }
        // for storing data in local
        if (couponDetail.getCoupon().type == 'New') {
            if (LocalDataSetup.getLocalData()) {
                var flagArray = [];
                $scope.existingData = []
                $scope.existingData = LocalDataSetup.getLocalData();
                if ($scope.coupon.ad_id != '') {
                    if ($scope.existingData.length > 0) {
                        for (var i = 0; i < $scope.existingData.length; i++) {
                            if ($scope.existingData[i].ad_id != null) {
                                if (flagArray.indexOf($scope.existingData[i].ad_id) === -1) {
                                    flagArray.push($scope.existingData[i].ad_id);
                                }
                            }

                        }
                        if ($scope.coupon.ad_id != null) {
                            if (flagArray.indexOf($scope.coupon.ad_id) === -1) {
                                $scope.existingData.push($scope.coupon);
                            }
                            LocalDataSetup.setLocalData($scope.existingData);
                        }
                    }
                } else {
                    $scope.existingData.push($scope.coupon);
                    LocalDataSetup.setLocalData($scope.existingData);
                }
            } else {
                $scope.localSetCouponScan.push($scope.coupon);
                LocalDataSetup.setLocalData($scope.localSetCouponScan);
            }
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        // calling google map function 
        if ($scope.coupon.business_latitude != '' && $scope.coupon.business_longitude != '') {
            initMap();
        }

    })


