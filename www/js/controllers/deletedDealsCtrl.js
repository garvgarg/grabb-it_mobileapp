
angular.module('grabbit')
    .controller('deletedDealsCtrl', function ($scope, $state, $ionicPopover, removeDataSetup, couponDetail, $timeout, $stateParams) {
        console.log("***** Inside deletedDealsCtrl ***** " + JSON.stringify($stateParams.type))
        $scope.isExistingDelete = false;
        // for top menu
         $scope.callMenu = function () {
            $scope.notShowDelete = false;
            $scope.notShowHistory = true;
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
            if(val === 'redeem'){
                $state.go('tab.redeeme-deals', { location: 'replace', cache: false });
            }else if(val === 'history'){
                $state.go('tab.deals', { location: 'replace', cache: false });
            } 
        };
        // end top menu
        $scope.doRefresh = function () {
            // console.log('Refreshing!');
            setTimeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 500);
        };
        $scope.loader = true;
        $scope.isCoupons = false;
        $scope.deleted = [];
        // for getting the data
        $scope.getDeals = function () {
            if (removeDataSetup.getLocalData() != null) {
                $scope.deleted = removeDataSetup.getLocalData();
                $scope.isExistingDelete = true;
                $scope.isCoupons = true;
                $scope.loader = true;
            }
            else {
                $scope.isCoupons = true;
                $scope.loader = true;
            }
        }


        $scope.couponFun = function (coupon, index) {
            window.localStorage.removeItem("couponData");
            var localSetCoupon = {
                'coupon': coupon,
                // 'lat': $scope.latitude,
                // 'long': $scope.longitude,
                'index': index,
                'type' : 'Exist'
            }
            couponDetail.setCoupon(localSetCoupon);
            $state.go('tab.scanDetails', { location: 'replace', cache: true })
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }

    })
