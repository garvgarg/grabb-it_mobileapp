
angular.module('grabbit')
    .controller('redeemeDealsCtrl', function ($scope, $state, $ionicPopover, grabbitService, redeemeDataSetup, couponDetail, LocalDataSetup, $timeout, $stateParams) {
        console.log("***** Inside redeemeDealsCtrl ***** " + JSON.stringify($stateParams.type))        
        $scope.isExistingRedeem = false;
        // for top menu
        $scope.callMenu = function () {
            $scope.notShowHistory = true;
            $scope.notShowDelete = true;
            $scope.notShowRedeem = false;
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
            if(val === 'delete'){
                $state.go('tab.deleted-deals', { location: 'replace', cache: false });
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
        $scope.Redeemed = [];
        // to get redeem data
        $scope.getDeals = function () {
            if (redeemeDataSetup.getLocalData() != null) {
                $scope.Redeemed = redeemeDataSetup.getLocalData();
                $scope.isExistingRedeem = true;
                $scope.isCoupons = true;
                $scope.loader = true;
            }
            else {
                $scope.isCoupons = true;
                $scope.loader = true;
            }
        }


        // for going to details page
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
