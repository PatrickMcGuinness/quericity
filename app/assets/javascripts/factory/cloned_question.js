quizlib.factory('ClonedQuestion', ['$resource', function($resource,$http) {
  function ClonedQuestion() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/:cloned_quiz_banks/:cloned_quiz_bank_id/:cloned_questions/:id', {id: '@id'},
                  {update:{method:"PUT",isArray:false}
                 });
  };
  ClonedQuestion.prototype.save = function(QuizId,ClonedQuizId,ClonedQuestion){
    return this.service.save({quiz_bank_id: QuizId,cloned_quiz_banks: "cloned_quiz_banks",cloned_quiz_bank_id: ClonedQuizId,cloned_questions: "cloned_questions"},ClonedQuestion)
  }
  return new ClonedQuestion;
}]);