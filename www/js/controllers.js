
angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $ionicLoading, $timeout,$http) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};
        $scope.selectRange = ['1', '2', '3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

        $scope.submit = function(){
            alert('submitted');
            var link = 'http://partner.adamstakeaway.co.uk/json/api.php';

            $http.post(link, JSON.stringify($scope.checkout)).then(function (response){
                alert(response.status);
            });
        };

        $scope.closed = false;


        //$scope.basketitems = JSON.parse(window.localStorage['basket'] || '{}');
        $scope.basketitems = [];



        $scope.setOrdertype = function (value) {
            if (value == 0) {
                $scope.checkout.delivery = true;
                $scope.checkout.deliveryfee = 1.00;
                $scope.checkout.collection = false;
            }
            if (value == 1) {
                $scope.checkout.delivery = false;
                $scope.checkout.deliveryfee = 0.00;
                $scope.checkout.collection = true;
            }
        }

        $scope.suboptions = {};
        $scope.pageTitle = "<img height='40' src=\"img/main-logo.png\" style='padding-top: 5px;'>";

        //$scope.initialPrice = 0;
        $scope.chkItem = function (item) {
            for (var i = 0; i < $scope.basketitems.length; i++) {
                if (angular.equals($scope.basketitems[i]["id"], item["id"])) {
                    return i;
                }
            }
            ;
            return -1;
        };

        $scope.chkQty = function () {
            var t = 0;
            for (var i = 0; i < $scope.basketitems.length; i++) {
             t += parseInt($scope.basketitems[i].qty);
            }
            return t;
        };

        $scope.chkCatQty = function (id) {
            var t = 0;
            for (var i = 0; i < $scope.basketitems.length; i++) {
                if (angular.equals($scope.basketitems[i]["cat"], id)) {
                    t += parseInt($scope.basketitems[i].qty);
                }

            }
            return t;
        };

        $scope.getBasketQty = function (item) {
            return $scope.basketitems[$scope.chkItem(item)].qty;
        };

        $scope.minusBasketQty = function (item) {
            --$scope.basketitems[$scope.chkItem(item)].qty;
        };

        $scope.initialPrice = function () {
            var total = 0;
            for (var i = 0; i < $scope.basketitems.length; i++) {
                var item = $scope.basketitems[i];
                total += parseFloat(item.price) * item.qty;
            }

            if (total > 0) {
                total = total + $scope.checkout.deliveryfee;
            }
            $scope.checkout.orderTotal = total;
            return total;
        };

        $scope.checkout = {
            delivery: true,
            collection: false,
            deliveryfee: 1.00,
            basket: $scope.basketitems,
            stripeToken: '',
            orderTotal: ''
        };


        // Create the login modal that we will use later
        $scope.modal = {};
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.modal2 = {};
        $ionicModal.fromTemplateUrl('templates/option.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeOption = function () {
            $scope.modal2.hide();
        };

        // Open the login modal
        $scope.option = function (item) {
            $scope.item = item;
            //alert(sub);
            $scope.modal2.show();
        };

        //$scope.$watch('onechoice', function (value) {
        //    $scope.onechoice = value;
        //    alert($scope.onechoice);
        //    console.log("Selected goalType, text: " + value);
        //});

        $scope.getSubname = function (item) {

            for (var i = 0; i < item.sub.length; i++) {
                if (angular.equals(parseInt(item.sub_id), parseInt(item.sub[i]["sub_id"]))) {
                    return item.sub[i]["sub_name"];
                }
            }
            return '';
        };


        $scope.addcart = function (item, sub_id) {
            if (sub_id == 1) {
                item.sub_id = $scope.onechoice.sub;
                $scope.onechoice.sub = null;
            }

            if ($scope.chkItem(item) == -1) {
                ++item.qty;
                $scope.basketitems.push(item);
            }
            else {
                ++$scope.basketitems[$scope.chkItem(item)].qty;
            }

            //window.localStorage['basket'] = JSON.stringify($scope.basketitems);


            $ionicLoading.show({
                template: 'Item added',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 100,
                showDelay: 0
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        };

        $scope.onechoice = {
            sub: null
        };

        $scope.removecart = function (index) {
            $scope.basketitems.splice(index, 1);
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('BrowseCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get("http://online.myautopos.co.uk/Customers_JSON.json")
            .success(function (response) {
                $scope.names = response;
            });
    }])

    .controller('BasketCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.shouldShowDelete = false;
        $scope.listCanSwipe = true;

        $scope.showDelete = function () {
            if ($scope.shouldShowDelete == true) {
                $scope.shouldShowDelete = false;
            }
            else {
                $scope.shouldShowDelete = true;
            }

        }
    }])

    .controller('PlaylistsCtrl', ['$scope', '$http', '$ionicLoading', function ($scope, $http, $ionicLoading) {
        $ionicLoading.show({
            template: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 100,
            showDelay: 0
        });
        $http.get("http://partner.adamstakeaway.co.uk/json/cats.php")
            .success(function (response) {
                //window.localStorage['name'] = 'Matt';
                $ionicLoading.hide();
                $scope.playlists = response;
            });
    }])

    .controller('CheckoutCtrl', ['$scope','$http', function ($scope,$http) {

        $scope.onSubmit = function () {
            $scope.processing = true;

        };

        $scope.stripeCallback = function (code, result) {
            $scope.processing = false;
            $scope.hideAlerts();
            if (result.error) {
                $scope.stripeError = result.error.message;

                alert($scope.stripeError);
            } else {
                $scope.checkout.stripeToken = result.id;

                var link = 'http://partner.adamstakeaway.co.uk/json/stripe.php';

                $http.post(link, JSON.stringify($scope.checkout)).then(function (response){
                    alert(response.data);
                });
            }
        };

        $scope.hideAlerts = function () {
            $scope.stripeError = null;
            $scope.stripeToken = null;
        };
    }])

    .controller('PlaylistCtrl', ['$scope', '$http', '$stateParams', '$ionicLoading', function ($scope, $http, $stateParams, $ionicLoading) {


        //$cordovaBadge.hasPermission().then(function() {
        //    alert('yes');
        //}, function() {
        //    alert('no');
        //});
        //
        //$cordovaBadge.set(3).then(function() {
        //    // You have permission, badge set.
        //}, function() {
        //    // You do not have permission.
        //});

        $ionicLoading.show({
            template: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 100,
            showDelay: 0
        });

        $http.get("http://partner.adamstakeaway.co.uk/json/items.php",
            {
                params: {q: $stateParams.playlistId}
            }
        )
            .success(function (response) {
                var name = window.localStorage['name'] || 'you';
                // alert('Hello, ' + name);
                $ionicLoading.hide();
                $scope.playlist = response;
            });
    }]);