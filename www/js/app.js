// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//Stripe.setPublishableKey('pk_test_5AMcSlvXPqufNvW68wFCSihn');

angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers','ngCordova','angularPayments'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      var push = new Ionic.Push({
          "debug": true,
          "onNotification": function(notification) {
              var payload = notification.payload;
              console.log(notification, payload);
          },
          "onRegister": function(data) {
              console.log(data.token);
          },
          "pluginConfig": {
              "ios": {
                  "badge": true,
                  "sound": true
              },
              "android": {
                  "iconColor": "#343434"
              }
          }
      });

      var callback = function(pushToken) {
          console.log(pushToken.token);
      };

      push.register(callback);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.style(1);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
        window.Stripe.setPublishableKey('pk_test_5AMcSlvXPqufNvW68wFCSihn');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $stateProvider




  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
      url: "/home",
      views: {
          'menuContent': {
              templateUrl: "templates/home.html"
          }
      }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  })

  .state('app.basket', {
      url: "/basket",
      views: {
          'menuContent': {
              templateUrl: "templates/basket.html"
          }
      }
  })

  .state('app.checkout', {
     url: "/checkout",
     views: {
         'menuContent': {
             templateUrl: "templates/checkout.html"
         }
     }
 })

  .state('app.deal', {
      url: "/deal",
      views: {
          'menuContent': {
              templateUrl: "templates/deal.html"
          }
      }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
		controller: 'BrowseCtrl'
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })
  .state('app.account', {
      url: "/account",
      views: {
          'menuContent': {
              templateUrl: "templates/account.html"
          }
      }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
