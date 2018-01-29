angular.module('grabbit')
    .controller('CurrentDealsDetailCtrl', function ($scope, $cordovaGeolocation, $cordovaLaunchNavigator, $state, $ionicPopup, grabbitService, couponDetail, LocalDataSetup, redeemeDataSetup) {
        console.log("***** Inside CurrentDealsDetailCtrl *****")
        $scope.Redeemed = [];
        $scope.showMapButton = true;
        $scope.coupon = couponDetail.getCoupon().coupon;
        // for redeem the coupon
        $scope.redeemedCategory = function () {
            var flagArray = [];
            if (redeemeDataSetup.getLocalData() != null) {
                $scope.Redeemed = redeemeDataSetup.getLocalData()
                if ($scope.Redeemed.length > 0) {
                    for (var i = 0; i < $scope.Redeemed.length; i++) {
                        if (flagArray.indexOf($scope.Redeemed[i].ad_id) === -1) {
                            flagArray.push($scope.Redeemed[i].ad_id);
                        }
                    }
                }
            }
            if (LocalDataSetup.getLocalData() != null) {
                $scope.current = LocalDataSetup.getLocalData()
            }

            if ($scope.Redeemed.length > 0) {
                if ($scope.coupon.ad_id != '') {
                    if (flagArray.indexOf($scope.coupon.ad_id) === -1) {
                        $scope.Redeemed.push($scope.current.splice(couponDetail.getCoupon().index, 1)[0]);
                        window.localStorage.removeItem("redeemeData");
                        redeemeDataSetup.setLocalData($scope.Redeemed);
                        window.localStorage.removeItem("storeLocalData");
                        LocalDataSetup.setLocalData($scope.current);
                        $ionicPopup.alert({title:'REDEEMED',template:'Coupon Redeemed successfully'});
                    } else if (flagArray.indexOf($scope.coupon.ad_id) != -1) {
                        $scope.current.splice(couponDetail.getCoupon().index, 1);
                        window.localStorage.removeItem("storeLocalData");
                        LocalDataSetup.setLocalData($scope.current);
                        $ionicPopup.alert({title:'REDEEMED',template:'Coupon Redeemed successfully'});
                    }
                    else {
                        $ionicPopup.alert({title:'FAILED',template:'Coupon Redeemed again'});
                    }
                } else {
                    $scope.Redeemed.push($scope.current.splice(couponDetail.getCoupon().index, 1)[0]);
                    window.localStorage.removeItem("redeemeData");
                    redeemeDataSetup.setLocalData($scope.Redeemed);
                    window.localStorage.removeItem("storeLocalData");
                    LocalDataSetup.setLocalData($scope.current);
                    $ionicPopup.alert({title:'REDEEMED',template:'Coupon Redeemed successfully'});
                }

            }
            else {
                $scope.Redeemed.push($scope.current.splice(couponDetail.getCoupon().index, 1)[0]);
                window.localStorage.removeItem("redeemeData");
                redeemeDataSetup.setLocalData($scope.Redeemed);
                window.localStorage.removeItem("storeLocalData");
                LocalDataSetup.setLocalData($scope.current);
                $ionicPopup.alert({title:'REDEEMED',template:'Coupon Redeemed successfully'});
            }
            // $state.go('tab.redeeme-deals', { location: 'replace', cache: true })
        }
       
        // for referesh the page
        $scope.doRefresh = function () {
            // console.log('Refreshing!');
            setTimeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 500);
        };
        // console.log(couponDetail.getCoupon())
        // for showing the location in map
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        // for showing the google map in application
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
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
            // console.log("======initmap", map, "****", infoWindow);
            // for dowing the path between two location
            // google.maps.event.addDomListener(document.getElementById('showPath'), 'click', drowRoutePath);

            drowRoutePath();
        }
        // for drow the path inside google map
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
                    // var end = new google.maps.LatLng(15.471879, 73.855591);
                    // var start = new google.maps.LatLng(37.329660, -121.889780);
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
                })

            } else {
                // var start = new google.maps.LatLng($scope.latitude, $scope.longitude);
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
        // for gooing on mobile google map application
        $scope.goGoogleMap = function () {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude
                    var long = position.coords.longitude
                    var destination = [$scope.coupon.business_latitude, $scope.coupon.business_longitude];
                    var start = [position.coords.latitude, position.coords.longitude];
                    $cordovaLaunchNavigator.navigate(destination, start).then(function () {
                        // console.log("Navigator launched");
                    }, function (err) {
                        // console.error(err);
                    });
                }, function (err) {
                    // error
                });
        }
        // finish google map
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        // caling google map function
        if ($scope.coupon.business_latitude != '' && $scope.coupon.business_longitude != '') {
            initMap()
        } else {
            $scope.showMapButton = false;
        }

    })


