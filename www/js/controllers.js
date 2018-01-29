angular.module('grabbit.controllers', [])
// for dash board(tutorial) controller
  .controller('DashCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {
    $scope.goSkip = function () {
      $state.go('tab.deals', {});
    }
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
  })
  .controller('TabsCtrl', function ($scope, $ionicTabsDelegate) {
    $scope.goHome = function () {
      console.log($ionicTabsDelegate.$getByHandle('my-tabs'));
      console.log($ionicTabsDelegate.$getByHandle('my-tabs').selectedIndex());
      $ionicTabsDelegate.$getByHandle('my-tabs').select(0);

    }
  })

