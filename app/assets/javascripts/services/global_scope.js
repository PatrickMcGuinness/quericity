quizlib.service('GlobalScope', function ($rootScope){
  var quiz_bank_id = 1 ;
  var section_id = 1;
  var question_id;
  return {
          get_quiz_bank_id : function() {
            return quiz_bank_id;
          },
          get_section_id: function(){
            return section_id;
          },
          set_quiz_bank_id: function(id){
            quiz_bank_id = id;
            $rootScope.$broadcast('quiz_bank_id_Changed', quiz_bank_id); 
          },
          set_section_id: function(id){
            section_id = id;
            $rootScope.$broadcast('section_id_Changed', section_id);
          },
          set_question_id: function(id){
            question_id = id;
            $rootScope.$broadcast('question_id_Changed', question_id);
          }
       };
    })