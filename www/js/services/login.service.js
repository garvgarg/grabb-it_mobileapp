angular.module('grabbit').service('grabbitService', grabbitService);
grabbitService.$inject = ['$http', '$q', 'myConfig'];

function grabbitService($http, $q, $scope, myConfig) {
    var service = {
        getLocationDeals: getLocationDeals
    }
    return service;

    // for coupon received 
    function getLocationDeals(data) {
        var deffered = $q.defer();
        var url = 'http://52.34.247.164:8080/portal/getCoupons?lat=' + data.lat + '&lng=' + data.lng;
        console.log("***URL***: " + url)
        var req = {
            method: 'GET',
            url: url,
        }
        $http(req).then(function (res) {
            if (res.status == 200) {
                deffered.resolve(res);
            } else {
                deffered.reject("data not found..");
            }
        }, function (err) {
            deffered.reject(err);
        });
        return deffered.promise;
    }
}
