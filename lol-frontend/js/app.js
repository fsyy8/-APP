// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.zhanji', {
      url: '/zhanji',
      views: {
        'tab-zhanji': {
          templateUrl: 'templates/tab-zhanji.html',
          controller: 'ZhanjiCtrl'
        }
      }
    })
    .state('tab.zhanji-detail',{
      url: '/zhanji/:chatId',
      views: {
        'tab-zhanji': {
          templateUrl: 'templates/zhanji-detail.html',
          controller: 'ZhanjiDetailCtrl'
        }
      }
    })

  .state('tab.gongju', {
      url: '/gongju',
      views: {
        'tab-gongju': {
          templateUrl: 'templates/tab-gongju.html',
          controller: 'GongjuCtrl'
        }
      }
    })
    .state('tab.tianqi', {
      url: '/gongju/tianqi',
      views: {
        'tab-gongju': {
          templateUrl: 'templates/gongju-tianqi.html',
          controller: 'TianqiCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.login',{
    url: '/account/login',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-login.html',
        controller: 'AccountLoginCtrl'
      }
    }
  })
  .state('tab.signup',{
    url: '/account/signup',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-signup.html',
        controller: 'AccountSignupCtrl'
      }
    }
  })
  .state('tab.about',{
    url: '/account/about',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-about.html',
        controller: 'AccountAboutCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/zhanji');

});
