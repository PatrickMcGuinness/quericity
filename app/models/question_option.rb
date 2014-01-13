class QuestionOption < ActiveRecord::Base
   attr_accessible :answer,:question_id,:is_correct
   belongs_to :question
end
