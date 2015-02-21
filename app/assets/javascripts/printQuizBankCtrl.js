quizlib.controller("printQuizBankCtrl",['$window','$scope','$location','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','Message','$rootScope',function($window,$scope,$location,$routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,Message,$rootScope){


  $scope.quiz_bank_id = $routeParams.id
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]
  $scope.quiz_section = []
  $scope.questions = []
  $scope.options_alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
  $scope.quiz_bank = []
  QuizBank.get($scope.quiz_bank_id).$promise.then(function(data){
    $scope.quiz_sections = data.sections
     angular.forEach(data.sections,function(value,key){
      angular.forEach(data.questions,function(value,key){
      $scope.questions.push(value)
      })
    })
    $scope.quiz_bank = data
  })

}])