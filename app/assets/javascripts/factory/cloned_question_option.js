quizlib.factory('ClonedQuestionOption', ['$resource', function($resource,$http) {
  function ClonedQuestionOption() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/cloned_quiz_banks/:cloned_quiz_bank_id/cloned_questions/:cloned_question_id/cloned_question_options/:id', {id: '@id'},
                  {update:{method:"PUT",isArray:false}
                 });
  };
  ClonedQuestionOption.prototype.save = function(QuizId,ClonedQuizId,ClonedQuestionId, ClonedQuestionOption){
    return this.service.save({quiz_bank_id: QuizId,cloned_quiz_bank_id: ClonedQuizId,cloned_question_id: ClonedQuestionId, cloned_question_options: "cloned_question_options"},ClonedQuestionOption)
  }
  return new ClonedQuestionOption;
}]);