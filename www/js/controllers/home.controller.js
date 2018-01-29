
angular.module('grabbit')
    .controller('HomeCtrl', function ($scope, $state, $cordovaBarcodeScanner, $ionicHistory, $ionicPopup, couponDetail, LocalDataSetup) {
        console.log("inside home controller...")

        $scope.tabLocationSelect = function (_scope) {
            // change the state back to the top state
            if (_scope.title === 'Deals') {
                setTimeout(function () {
                    $state.go('tab.deals', { cache: false });
                }, 20);
            } else if (_scope.title === 'Scan Deal') {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                setTimeout(function () {
                    // for barcode scanner
                    $scope.scanQR = function () {
                        document.addEventListener("deviceready", function () {
                            $cordovaBarcodeScanner
                                .scan()
                                .then(function (barcodeData) {
                                    // alert("QR_CODE--"+barcodeData.format);
                                    if (barcodeData.cancelled) {
                                        $state.go('tab.deals', {});
                                    } else {
                                        // alert(barcodeData.text);
                                        var value = barcodeData.text;
                                        var lines = value.split("\n");
                                        // to set scan data below variable
                                        $scope.localDataTest = {
                                            'business_name': '',
                                            'img_url': '',
                                            'title': '',
                                            'description': '',
                                            'ad_id':'',
                                            'business_longitude': '',
                                            'business_latitude': ''
                                        }
                                        for (var i = 0; i < lines.length; i++) {
                                            var json = JSON.parse(mapDOM(lines[i], true));
                                            // alert(JSON.stringify(json))
                                            if (json.type === "img") {   //for reading image
                                                var tempImage = json.attributes;
                                                // alert(tempImage.src);
                                                $scope.localDataTest.img_url = tempImage.src;
                                            }
                                            else if (json.type === "h2") {  //reading  data from h2 tag which will be name or title
                                                var temp = json.attributes;
                                                if (temp.class === "name") {
                                                    $scope.localDataTest.business_name = json.content[0];
                                                } else {
                                                    $scope.localDataTest.title = json.content[0];
                                                }
                                            }
                                            else if (json.type === "p") {    //reading  data from p tag which is description
                                                $scope.localDataTest.description = json.content[0];
                                            }
                                        }                        
                                        if ($scope.localDataTest.img_url != '' && $scope.localDataTest.title == '' && $scope.localDataTest.description == '') {
                                            $scope.flag = true;
                                            window.localStorage.removeItem("couponData");
                                            var localSetData = {
                                                'coupon': $scope.localDataTest,
                                                'type': 'New'
                                            }
                                            couponDetail.setCoupon(localSetData);
                                            $state.go('tab.scanDetails', {},{reload : true});
                                        } else if ($scope.localDataTest.business_name != '' && $scope.localDataTest.title != '' && $scope.localDataTest.description != '') {
                                            if (LocalDataSetup.getLocalData() != null && LocalDataSetup.getLocalData() != undefined) {
                                                var flagArray = [];
                                                $scope.existingData = []
                                                $scope.existingData = LocalDataSetup.getLocalData();
                                                $scope.existingData.push($scope.localDataTest);
                                                LocalDataSetup.setLocalData($scope.existingData.reverse());
                                                $state.go('tab.deals', {}, { reload : true });
                                            } else {                                                
                                                $scope.localSetCouponScan = [];
                                                $scope.localSetCouponScan.push($scope.localDataTest);
                                                LocalDataSetup.setLocalData($scope.localSetCouponScan);
                                                $state.go('tab.deals', {}, { reload : true });
                                                // $state.go('tab.deals', { location: 'replace', cache: false });
                                            }
                                        }
                                        else {
                                            // alert('Invalid Data');
                                            $scope.scanAgain();
                                        }
                                    }
                                }, function (error) {
                                    // An error occurred
                                    // alert("Scanning failed: " + error);
                                    $scope.scanAgain();
                                });
                            // NOTE: encoding not functioning yet
                            $cordovaBarcodeScanner
                                .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
                                .then(function (success) {
                                    // Success!
                                    // navigator.notification.alert('function')
                                }, function (error) {
                                    // An error occurred
                                    $ionicPopup.alert({title:'FAILED',template:'OK'});
                                });

                        }, false)
                    }
                    $scope.scanQR();
                }, 20);
            } else {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            }
        }
        $scope.scanAgain = function () {
            $ionicPopup.confirm({
                title: 'Invalid',
                template: 'Please scan a valid QR',
                buttons: [
                    { text: 'Scan', onTap: function (e) { return false; } },
                    {
                        text: '<b>Go for Deals</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return true;
                        }
                    },]
            }).then(function (res) {
                if (res) {
                    console.log('You are sure');
                    $state.go('tab.deals', {});
                } else {
                    console.log('You are not sure');
                    $scope.scanQR();
                }
            });
        }
        // for parsing html content into json format
        function mapDOM(element, json) {
            var treeObject = {};

            // If string convert to document Node
            if (typeof element === "string") {
                if (window.DOMParser) {
                    parser = new DOMParser();
                    docNode = parser.parseFromString(element, "text/xml");
                } else { // Microsoft strikes again
                    docNode = new ActiveXObject("Microsoft.XMLDOM");
                    docNode.async = false;
                    docNode.loadXML(element);
                }
                element = docNode.firstChild;
            }

            //Recursively loop through DOM elements and assign properties to object
            function treeHTML(element, object) {
                object["type"] = element.nodeName;
                var nodeList = element.childNodes;
                if (nodeList != null) {
                    if (nodeList.length) {
                        object["content"] = [];
                        for (var i = 0; i < nodeList.length; i++) {
                            if (nodeList[i].nodeType == 3) {
                                object["content"].push(nodeList[i].nodeValue);
                            } else {
                                object["content"].push({});
                                treeHTML(nodeList[i], object["content"][object["content"].length - 1]);
                            }
                        }
                    }
                }
                if (element.attributes != null) {
                    if (element.attributes.length) {
                        object["attributes"] = {};
                        for (var i = 0; i < element.attributes.length; i++) {
                            object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                        }
                    }
                }
            }
            treeHTML(element, treeObject);

            return (json) ? JSON.stringify(treeObject) : treeObject;
        }
        // end formatation
        $scope.tabDeselect = function (_data) {
            // console.log("onTabdeselected", _data);
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        }

    })
