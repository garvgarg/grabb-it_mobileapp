// Ionic Starter App
angular.module('grabbit', ['ionic', 'ngCordova', 'grabbit.controllers', 'grabbit.services'])
  .constant("myConfig", {
    "serviceUrl": "http://52.34.247.164:8080/portal/"
    // "port": "80"
  })
  .config(['$ionicConfigProvider', function ($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    // for not saving the data in cache
    $ionicConfigProvider.views.maxCache(0);

  }])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function ($cordovaStatusbar) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.cordova && window.cordova.logger) {
        window.cordova.logger.__onDeviceReady();
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      // for status bar color same as the ui color
      // $cordovaStatusbar.overlaysWebView(true);
      // $cordovaStatusbar.style(1);
      // $cordovaStatusbar.styleColor('orange');
 
      ionic.Platform.fullScreen();
    });
  })



  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      // for showing detail after scan the QR
      .state('tab.scanDetails', {
        url: '/scanDetails',
        views: {
          'tab-scan': {
            templateUrl: 'templates/tab-scan-detail.html',
            controller: 'ScanDetailsCtrl'
          }
        }
      })
      //for current deals page
      .state('tab.deals', {
        url: '/deals',
        views: {
          'tab-deals': {
            templateUrl: 'templates/tab-current-deals.html',
            // params: {"type": null},
            controller: 'CurrentDealsCtrl'
          }
        }
      })
      // for details of the coupon
      .state('tab.deals-detail', {
        url: '/couponDetails',
        views: {
          'tab-deals': {
            templateUrl: 'templates/deals-details.html',
            controller: 'CurrentDealsDetailCtrl'
          }
        }
      })
      // for showing the delete tab
      .state('tab.deleted-deals', {
        url: '/deletedDeals',
        views: {
          'tab-deals': {
            templateUrl: 'templates/deleted-deals.html',
            controller: 'deletedDealsCtrl'
          }
        }
      })
      // fr showing the redeem tab
      .state('tab.redeeme-deals', {
        url: '/redeemeDeals',
        views: {
          'tab-deals': {
            templateUrl: 'templates/redeeme-deals.html',
            controller: 'redeemeDealsCtrl'
          }
        }
      })      

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/tab/dash');
    $urlRouterProvider.otherwise('tab/dash');

  });
