var student_quizlib = angular.module('student_quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);

student_quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/quizlist', 
      {templateUrl: 'assets/partials/students/quizlist.html',controller: 'QuizListCtrl',activetab: 'quiz'}).
      when('/quiz/:id/attempt', 
      {templateUrl: 'assets/partials/students/attempt.html',controller: 'QuizAttemptCtrl',activetab: 'quiz'}).
      when('/quiz/:id/answers', 
      {templateUrl: 'assets/partials/students/answers.html',controller: 'AnswersCtrl',activetab: 'quiz'}).
      when('/dashboard', 
      {templateUrl: 'assets/partials/students/dashboard.html',controller: 'DashBoardCtrl',activetab: 'dashboard'}).
      when('/dashboard/quiz/:id',
      {templateUrl: 'assets/partials/students/quiz_detail.html',controller: 'QuizDetailCtrl',activetab: 'dashboard'}).
      otherwise({redirectTo: '/quizlist'})
  }]);