quizlib.controller('QuizBankCtrl', ['$scope', 'QuizBank', function($scope, QuizBank) {
  $scope.entries = QuizBank.all()

  $scope.addQuiz= function(){
    quiz_bank = QuizBank.save($scope.newEntry)
    $scope.entries.push(quiz_bank)
    $scope.newEntry = {}
  }
  $scope.deleteQuiz = function(id,idx) {
    $scope.entries.splice(idx, 1);
    QuizBank.delete(id);
  };
  $scope.publicQuiz = function(quiz_bank){
    quiz_bank.public = true
    QuizBank.updateQuiz(quiz_bank)
  }
  $scope.privateQuiz = function(quiz_bank){
    quiz_bank.public = false
    QuizBank.updateQuiz(quiz_bank)
  }

}]);

quizlib.controller("ManageCtrl",['$scope','QuizBank',function($scope, QuizBank){
  console.log("hello")
  $scope.quiz_banks = QuizBank.all()
}])

quizlib.controller("NewQuizBankCtrl",['$scope','$http','QuizBank','Repository',function($scope, $http,QuizBank, Repository){
  var quiz_bank = null
  $http.get('/repositories/default_repo.json').
    success(function(data) {
      QuizBank.save({title: "My Quiz Bank",repository_id: data.repo.id})
    })
    console.log(quiz_bank)
  
  


}])