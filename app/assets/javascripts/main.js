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
      when('/quiz_banks/:id/edit',
      {templateUrl: 'assets/partials/quiz_banks/edit.html',controller: 'EditQuizBankCtrl'}).
      when('/quiz_banks/:id/clone',
      {templateUrl: 'assets/partials/quiz_banks/clone.html',controller: 'CloneQuizBankCtrl'}).
      when('/serve_quizzes/serve_list',
      {templateUrl: 'assets/partials/serve_quiz/serve_list.html',controller: 'ServeQuizCtrl'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
  }]);