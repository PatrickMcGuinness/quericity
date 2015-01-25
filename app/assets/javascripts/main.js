var quizlib = angular.module('quizlib', ['ngResource', 'ngRoute','ui.bootstrap','angular-tour','ngQuickDate','ngTagsInput']);
 
quizlib.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/manage_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/index.html',controller: 'ManageCtrl',activetab: 'manage'}).
      when('/manage_quiz_banks/starred_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/starred_assessments.html',controller: 'ManageStarredCtrl',activetab: 'manage'}).
      when('/manage_quiz_banks/shared_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/shared_assessments.html',controller: 'ManageSharedCtrl',activetab: 'manage'}).
      when('/manage_quiz_banks/my_quiz_banks', 
      {templateUrl: 'assets/partials/manage_quiz_banks/my_assessments.html',controller: 'ManageMyCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/share', 
      {templateUrl: 'assets/partials/manage_quiz_banks/sharing.html',controller: 'ShareCtrl',activetab: 'manage'}).
      when('/quiz_banks/new',
      {templateUrl: 'assets/partials/quiz_banks/new.html',controller: 'NewQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/show',
      {templateUrl: 'assets/partials/quiz_banks/show.html',controller: 'ShowQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/edit',
      {templateUrl: 'assets/partials/quiz_banks/edit.html',controller: 'EditQuizBankCtrl',activetab: 'manage'}).
      when('/quiz_banks/:id/print',
      {templateUrl: 'assets/partials/quiz_banks/print.html',controller: 'printQuizBankCtrl',activetab: 'print'}).
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
      when('/groups/:id/view',
      {templateUrl: 'assets/partials/groups/view.html',controller: 'ViewGroupCtrl',activetab: 'serve'}).
      when('/quiz_banks/:id/preview',
      {templateUrl: 'assets/partials/quiz_banks/preview.html',controller: 'PreviewQuizCtrl',activetab: 'manage'}).
      when('/grade',
      {templateUrl: 'assets/partials/grade/index.html',controller: 'GradeListQuizCtrl',activetab: 'grade'}).
      when('/grade/:id/questions',
      {templateUrl: 'assets/partials/grade/question_to_grade.html',controller: 'GradeQuestionCtrl',activetab: 'grade'}).
      when('/analyze/student_report',
      {templateUrl: 'assets/partials/analyze/student_report.html',controller: 'StudentReportCtrl',activetab: 'analyze'}).
      when('/analyze/quiz/:id',
      {templateUrl: 'assets/partials/analyze/quiz_detail.html',controller: 'QuizDetailCtrl',activetab: 'analyze'}).
      when('/analyze/quiz_report',
      {templateUrl: 'assets/partials/analyze/quiz_report.html',controller: 'QuizReportCtrl',activetab: 'analyze'}).
      when('/settings',
      {templateUrl: 'assets/partials/settings/settings.html',controller: 'SettingsCtrl',activetab: 'settings'}).
      when('/settings/change_password',
      {templateUrl: 'assets/partials/settings/change_password.html',controller: 'PasswordCtrl',activetab: 'settings'}).
      otherwise({redirectTo: '/manage_quiz_banks'})
}]);