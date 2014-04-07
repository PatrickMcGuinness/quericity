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
      when('/served_quizzes',
      {templateUrl: 'assets/partials/serve_quiz/index.html',controller: 'ServeQuizCtrl'}).
      when('/serve_quiz/new',
      {templateUrl: 'assets/partials/serve_quiz/options.html',controller: 'NewServeQuizCtrl'}).
      when('/groups',
      {templateUrl: 'assets/partials/groups/index.html',controller: 'GroupListCtrl'}).
      when('/groups/new',
      {templateUrl: 'assets/partials/groups/add_group.html',controller: 'AddGroupCtrl'}).
      when('/groups/:id/edit',
      {templateUrl: 'assets/partials/groups/edit.html',controller: 'EditGroupCtrl'}).
      when('/quiz_banks/:id/preview',
      {templateUrl: 'assets/partials/quiz_banks/preview.html',controller: 'PreviewQuizCtrl'}).
      when('/grade',
      {templateUrl: 'assets/partials/grade/index.html',controller: 'GradeListQuizCtrl'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
  }]);