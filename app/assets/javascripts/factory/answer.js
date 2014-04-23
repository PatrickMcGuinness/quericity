student_quizlib.factory('Answer', ['$resource', function($resource,$http) {
  function Answer() {
    this.service = $resource('/answers/:id/:student_answers_in_served_quiz', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                  student_answers_in_served_quiz: {method: "GET",isArray:true}
                 });
  };
  Answer.prototype.save = function(Answer){
    return this.service.save(Answer)
  }
  Answer.prototype.get = function(AnswerId){
    return this.service.get({id: AnswerId})
  }
  Answer.prototype.update = function(AnswerId,Answer){
    return this.service.get({id: AnswerId},Answer)
  }
  Answer.prototype.student_answers_in_served_quiz = function(ServedQuizId){
    return this.service.student_answers_in_served_quiz({id: ServedQuizId, student_answers_in_served_quiz: "student_answers_in_served_quiz"})
  }
  return new Answer;
}]);