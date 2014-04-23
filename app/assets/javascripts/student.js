var student_quizlib = angular.module('student_quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);

student_quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/quizlist', 
      {templateUrl: 'assets/partials/students/quizlist.html',controller: 'QuizListCtrl',activetab: 'quiz'}).
      when('/quiz/:id/instructions', 
      {templateUrl: 'assets/partials/students/instructions.html',controller: 'QuizInstuctionCtrl',activetab: 'quiz'}).
      when('/quiz/:id/attempt', 
      {templateUrl: 'assets/partials/students/attempt.html',controller: 'QuizAttemptCtrl',activetab: 'quiz'}).
      otherwise({redirectTo: '/quizlist'})
  }]);