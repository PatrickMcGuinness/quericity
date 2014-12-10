var student_quizlib = angular.module('student_quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);

student_quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/dashboard', 
      {templateUrl: 'assets/partials/students/dashboard.html',controller: 'QuizListCtrl',activetab: 'dashboard'}).
      when('/quiz/:id/attempt', 
      {templateUrl: 'assets/partials/students/attempt.html',controller: 'QuizAttemptCtrl',activetab: 'quiz'}).
      when('/quiz/:id/answers', 
      {templateUrl: 'assets/partials/students/answers.html',controller: 'AnswersCtrl',activetab: 'quiz'}).
      when('/reports', 
      {templateUrl: 'assets/partials/students/reports.html',controller: 'DashBoardCtrl',activetab: 'dashboard'}).
      when('/reports/quiz/:id',
      {templateUrl: 'assets/partials/students/quiz_detail.html',controller: 'QuizDetailCtrl',activetab: 'reports'}).
      when('/settings',
      {templateUrl: 'assets/partials/settings/settings.html',controller: 'SettingsCtrl',activetab: 'settings'}).
      when('/take_quiz',
      {templateUrl: 'assets/partials/students/take_quiz.html',controller: 'TakeQuizCtrl',activetab: 'quiz'}).
      when('/finish_quiz',
      {templateUrl: 'assets/partials/students/finishQuiz.html',controller: 'FinishQuizCtrl',activetab: 'quiz'}).
       when('/enrol_group',
      {templateUrl: 'assets/partials/students/enrol_group.html',controller: 'EnrolGroupCtrl',activetab: 'groups'}).
      otherwise({redirectTo: '/dashboard'})
  }]);
