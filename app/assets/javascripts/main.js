var quizlib = angular.module('quizlib', ['ngResource', 'ngRoute','ui.bootstrap']);
 
quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/manage_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/index.html',controller: 'ManageCtrl',activetab: 'manage'}).
      when('/quiz_banks/new',
      {templateUrl: 'assets/partials/quiz_banks/new.html',controller: 'NewQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/show',
      {templateUrl: 'assets/partials/quiz_banks/show.html',controller: 'ShowQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/edit',
      {templateUrl: 'assets/partials/quiz_banks/edit.html',controller: 'EditQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/clone',
      {templateUrl: 'assets/partials/quiz_banks/clone.html',controller: 'CloneQuizBankCtrl',activetab: 'manage'}).
      when('/served_quizzes',
      {templateUrl: 'assets/partials/serve_quiz/index.html',controller: 'ServeQuizCtrl',activetab: 'serve'}).
      when('/serve_quiz/new',
      {templateUrl: 'assets/partials/serve_quiz/options.html',controller: 'NewServeQuizCtrl',activetab: 'serve'}).
      when('/groups',
      {templateUrl: 'assets/partials/groups/index.html',controller: 'GroupListCtrl',activetab: 'serve'}).
      when('/groups/new',
      {templateUrl: 'assets/partials/groups/add_group.html',controller: 'AddGroupCtrl',activetab: 'serve'}).
      when('/groups/:id/edit',
      {templateUrl: 'assets/partials/groups/edit.html',controller: 'EditGroupCtrl',activetab: 'serve'}).
      when('/quiz_banks/:id/preview',
      {templateUrl: 'assets/partials/quiz_banks/preview.html',controller: 'PreviewQuizCtrl',activetab: 'manage'}).
      when('/grade',
      {templateUrl: 'assets/partials/grade/index.html',controller: 'GradeListQuizCtrl',activetab: 'grade'}).
      when('/grade/:id/questions',
      {templateUrl: 'assets/partials/grade/question_to_grade.html',controller: 'GradeQuestionCtrl',activetab: 'grade'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
}]);