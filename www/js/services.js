angular.module('grabbit.services', [])

  // for storing single coupon in local
  .factory('couponDetail', function () {
    var couponData = {};
    return {
      setCoupon: function (coupon) {
        // couponData = coupon
        couponData = window.localStorage.setItem("couponData", JSON.stringify(coupon))
        return function () {
          return couponData;
        };
      },
      getCoupon: function () {
        couponData = JSON.parse(window.localStorage.getItem("couponData"))
        return couponData;
      }
    };
  })
  // for saving the history data locally
  .factory('LocalDataSetup', function () {
    var localData = {};
    return {
      setLocalData: function (data) {
        // couponData = coupon
        window.localStorage.setItem("storeLocalData", JSON.stringify(data))
        return function () {
          return localData;
        };
      },
      getLocalData: function () {
        localData = JSON.parse(window.localStorage.getItem("storeLocalData"))
        return localData;
      }
    };
  })
  // for saving the delete data locally
  .factory('removeDataSetup', function () {
    var localData = {};
    return {
      setLocalData: function (data) {
        // couponData = coupon
        window.localStorage.setItem("removeData", JSON.stringify(data))
        return function () {
          return localData;
        };
      },
      getLocalData: function () {
        localData = JSON.parse(window.localStorage.getItem("removeData"))
        return localData;
      }
    };
  })
  // for saving the redeem data locally
  .factory('redeemeDataSetup', function () {
    var localData = {};
    return {
      setLocalData: function (data) {
        // couponData = coupon
        window.localStorage.setItem("redeemeData", JSON.stringify(data))
        return function () {
          return localData;
        };
      },
      getLocalData: function () {
        localData = JSON.parse(window.localStorage.getItem("redeemeData"))
        return localData;
      }
    };
  })
// for err-src directive
.directive('errSrc', function () {
  return {
    link: function (scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });

      attrs.$observe('ngSrc', function (value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
