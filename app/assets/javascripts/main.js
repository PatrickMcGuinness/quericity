var quizlib = angular.module('quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);
 
quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/manage_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/index.html',
      controller: 'ManageCtrl'}).
      when('/quiz_banks/new',
      {templateUrl: 'assets/partials/quiz_banks/new.html',controller: 'NewQuizBankCtrl'}).
      when('/quiz_banks/:id/show',
      {templateUrl: 'assets/partials/quiz_banks/show.html',controller: 'ShowQuizBankCtrl'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
  }]);