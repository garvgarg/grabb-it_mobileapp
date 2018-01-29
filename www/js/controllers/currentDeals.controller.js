
angular.module('grabbit')
    .controller('CurrentDealsCtrl', function ($scope,$cordovaDevice, $state, $cordovaProgress, $ionicPopover, $ionicPopup, $cordovaGeolocation, grabbitService, removeDataSetup, couponDetail, LocalDataSetup, $timeout, $stateParams) {
        console.log("***** Inside CurrentDealsCtrl ***** " + JSON.stringify($stateParams.type))
        console.log("****************");

        document.addEventListener("deviceready", function () {
            
                var device = $cordovaDevice.getDevice();
            
                var cordova = $cordovaDevice.getCordova();
            
                var model = $cordovaDevice.getModel();
            
                var platform = $cordovaDevice.getPlatform();
            
                var uuid = $cordovaDevice.getUUID();
            
                var version = $cordovaDevice.getVersion();

                console.log("())()()()()-----",model);
            
                // alert(model);
              }, false);

        $scope.$on('$ionicView.enter', function () {
            submit('default');
        })
        // for top dropdown menu bar
        $scope.callMenu = function () {
            $scope.notShowHistory = false;
            $scope.notShowDelete = true;
            $scope.notShowRedeem = true;
        }
        $scope.callMenu();
        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.showMenu = function ($event) {
            $scope.popover.show($event);
        }
        $scope.closePopover = function (val) {
            $scope.popover.hide();
            if (val === 'redeem') {
                $state.go('tab.redeeme-deals', { location: 'replace', cache: false });
            } else if (val === 'delete') {
                $state.go('tab.deleted-deals', { location: 'replace', cache: false });
            }
        };
        // end dropdown
        $scope.doRefresh = function () {
            // console.log('Refreshing!');
            setTimeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 500);
        };
        $scope.slectedType = '';

        $scope.deleted = [];
        $scope.coupons = [];
        $scope.existingData = [];
        $scope.oldExistingData = [];
        $scope.isCoupons = false;
        $scope.isCurrentCoupon = false;
        $scope.isExistingCoupon = false;
        $scope.zeroResult = false;
        $scope.loader = true;
        // for delete the coupon
        $scope.removeCategory = function (index, currentCoupon) {
            var flagArray = [];
            if (removeDataSetup.getLocalData() != null) {
                $scope.deleted = removeDataSetup.getLocalData();
                if ($scope.deleted.length > 0) {
                    for (var i = 0; i < $scope.deleted.length; i++) {
                        if (flagArray.indexOf($scope.deleted[i].ad_id) === -1) {
                            flagArray.push($scope.deleted[i].ad_id);
                        }
                    }
                }
            }
            if ($scope.deleted.length > 0) {
                if (currentCoupon.ad_id != '') {
                    if (flagArray.indexOf(currentCoupon.ad_id) === -1) {
                        $scope.deleted.push($scope.currentData.splice(index, 1)[0]);
                        window.localStorage.removeItem("removeData");
                        removeDataSetup.setLocalData($scope.deleted);
                        window.localStorage.removeItem("storeLocalData");
                        LocalDataSetup.setLocalData($scope.currentData);
                        $ionicPopup.alert({title:'DELETED',template:'Coupon Deleted successfully'});
                    } else if (flagArray.indexOf(currentCoupon.ad_id) != -1) {
                        $scope.currentData.splice(index, 1);
                        window.localStorage.removeItem("storeLocalData");
                        LocalDataSetup.setLocalData($scope.currentData);
                        $ionicPopup.alert({title:'DELETED',template:'Coupon Deleted successfully'});
                    }
                    else {
                        $ionicPopup.alert({title:'FAILED',template:'Coupon Delete Again!'});
                    }
                } else {
                    $scope.deleted.push($scope.currentData.splice(index, 1)[0]);
                    window.localStorage.removeItem("removeData");
                    removeDataSetup.setLocalData($scope.deleted);
                    window.localStorage.removeItem("storeLocalData");
                    LocalDataSetup.setLocalData($scope.currentData);
                    $ionicPopup.alert({title:'DELETED',template:'Coupon Deleted successfully'});
                }

            }
            else {
                $scope.deleted.push($scope.currentData.splice(index, 1)[0]);
                window.localStorage.removeItem("removeData");
                removeDataSetup.setLocalData($scope.deleted);
                window.localStorage.removeItem("storeLocalData");
                LocalDataSetup.setLocalData($scope.currentData);
                $ionicPopup.alert({title:'DELETED',template:'Coupon Deleted successfully'});
            }


        }
        
        if ($stateParams && $stateParams.type) {
            $scope.slectedType = $stateParams.type;
            submit($scope.slectedType);
        }
        
        // for getting the coupon
        $scope.getDeals = function (type) {
            $scope.isCoupons = false;
            $scope.isCurrentCoupon = false;
            $scope.isExistingCoupon = false;
            $scope.loader = true;
            submit(type)
        }
        // hitting the function at to get new deals
        function submit(type) {
            $scope.slectedType = type;
            if (navigator.geolocation && $scope.slectedType != 'default') {
                var params = {};
                //Calling latitude and longitude of user location
                $cordovaProgress.showSimpleWithLabel(true, "Loading");
                var posOptions = { timeout: 10000, enableHighAccuracy: false };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        $scope.position = position;
                        $scope.latitude = position.coords.latitude;
                        $scope.longitude = position.coords.longitude;
                        // for demo data
                        // params.lat = '37.329660';
                        // params.lng = '-121.889780';
                        // for real time
                        params.lat = $scope.latitude;
                        params.lng = $scope.longitude;
                        $scope.loader = true;
                        grabbitService.getLocationDeals(params).then(function (resp) {
                            // console.log(resp)
                            if (resp.data.coupons) {
                                $scope.isCurrentCoupon = true;
                                $scope.isCoupons = true;
                                $scope.loader = true;
                                $scope.coupons = resp.data.coupons;
                                if (LocalDataSetup.getLocalData()) {
                                    $scope.isCurrentCoupon = true;
                                    var flagArray = [];
                                    $scope.existingData = LocalDataSetup.getLocalData();
                                    for (var i = 0; i < $scope.coupons.length; i++) {
                                        if (flagArray.indexOf($scope.coupons[i].ad_id) === -1) {
                                            flagArray.push($scope.coupons[i].ad_id);
                                        }
                                    }
                                    for (var j = 0; j < $scope.existingData.length; j++) {
                                        if (flagArray.indexOf($scope.existingData[j].ad_id) != -1) {
                                            $scope.existingData.splice(j, 1);
                                            j--;
                                        }
                                    }
                                    if ($scope.coupons.length > 0) {
                                        for (var k = 0; k < $scope.coupons.length; k++) {
                                            $scope.existingData.push($scope.coupons[k]);
                                        }
                                    }
                                    window.localStorage.removeItem("storeLocalData");
                                    LocalDataSetup.setLocalData($scope.existingData.reverse());
                                    $scope.currentData = $scope.existingData.reverse();
                                    if ($scope.existingData.length > 50) {
                                        $ionicPopup.confirm({
                                            title: '!Caution',
                                            template: 'Would you like to delete above fifty records',
                                            buttons: [
                                                { text: 'NO', onTap: function (e) { return false; } },
                                                {
                                                    text: '<b>YES</b>',
                                                    type: 'button-positive',
                                                    onTap: function (e) {
                                                        return true;
                                                    }
                                                },]
                                        }).then(function (res) {
                                            if (res) {
                                                var deleteData = $scope.existingData.reverse();
                                                for (var i = 0; i < deleteData.length; i++) {
                                                    if (i > 49) {
                                                        deleteData.splice(deleteData[i], 1);
                                                        i--;
                                                    }
                                                }
                                                $scope.existingData = deleteData;
                                            } else {
                                                // console.log('You are not sure');
                                            }
                                        });
                                    }
                                } else {
                                    $scope.isCurrentCoupon = true;
                                    $scope.currentData = $scope.coupons;
                                    LocalDataSetup.setLocalData($scope.coupons);
                                }
                            } else if (resp.status = 'ZERO_RESULTS') {
                                $scope.zeroResult = true;
                                if (LocalDataSetup.getLocalData()) {
                                    $scope.isCurrentCoupon = true;
                                    $scope.isCoupons = true;
                                    $scope.loader = true;
                                    $scope.currentData = LocalDataSetup.getLocalData();
                                } else {
                                    $scope.isCoupons = false;
                                    $scope.loader = false;
                                    $scope.isCurrentCoupon = false;
                                    $scope.isExistingCoupon = false;
                                }
                            } else if (LocalDataSetup.getLocalData()) {
                                $scope.isCurrentCoupon = true;
                                $scope.isCoupons = true;
                                $scope.loader = true;
                                $scope.currentData = LocalDataSetup.getLocalData();
                            } else {
                                $scope.isCoupons = false;
                                $scope.loader = false;
                                $scope.isCurrentCoupon = false;
                                $scope.isExistingCoupon = false;
                                $cordovaProgress.hide();
                            }
                            $cordovaProgress.hide();
                        }, function (err) {
                            if (LocalDataSetup.getLocalData()) {
                                $scope.isCurrentCoupon = true;
                                $scope.isCoupons = true;
                                $scope.loader = true;
                                $scope.currentData = LocalDataSetup.getLocalData();
                            } else {
                                $scope.isCoupons = false;
                                $scope.loader = false;
                                $scope.isCurrentCoupon = false;
                                $scope.isExistingCoupon = false;
                            }
                            $cordovaProgress.hide();
                        })
                    }, function (err) {
                        // error
                        $ionicPopup.alert({title:'FAILED',template:'Not able to fetch location Plz try again!'});                                               
                        if (LocalDataSetup.getLocalData()) {
                            $scope.isCurrentCoupon = true;
                            $scope.isCoupons = true;
                            $scope.loader = true;
                            $scope.currentData = LocalDataSetup.getLocalData();
                        } else {
                            $scope.isCoupons = false;
                            $scope.loader = false;
                            $scope.isCurrentCoupon = false;
                            $scope.isExistingCoupon = false;
                        }
                        $cordovaProgress.hide();
                    });
            }
            else {
                // for default latitude and longitude
                if ($scope.slectedType == 'default') {
                    if (LocalDataSetup.getLocalData()) {
                        $scope.isCurrentCoupon = true;
                        $scope.isCoupons = true;
                        $scope.loader = true;
                        $scope.currentData = LocalDataSetup.getLocalData();
                    } else {
                        $scope.isCoupons = false;
                        $scope.loader = false;
                        $scope.isCurrentCoupon = false;
                        $scope.isExistingCoupon = false;
                    }
                    // })
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                }

            }
        }
        // $scope.getDeals('default');

        $scope.couponFun = function (coupon, index) {
            window.localStorage.removeItem("couponData");
            var localSetCoupon = {
                'coupon': coupon,
                'lat': $scope.latitude,
                'long': $scope.longitude,
                'index': index
            }
            couponDetail.setCoupon(localSetCoupon);
            $state.go('tab.deals-detail', { location: 'replace', cache: false })
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }

    })
