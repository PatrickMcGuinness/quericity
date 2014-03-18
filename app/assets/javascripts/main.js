var quizlib = angular.module('quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);
 
quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/manage_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/index.html.haml',
      controller: 'ManageCtrl'}).
      when('/quiz_banks/new',
      {templateUrl: 'assets/partials/quiz_banks/new.html.haml',controller: 'NewQuizBankCtrl'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
  }]);