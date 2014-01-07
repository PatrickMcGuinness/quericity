class Question < ActiveRecord::Base
   attr_accessible :subject_id,:seq,:description,:type,:difficulty_level,:reference_url,:section_id
   
   belongs_to :section
   belongs_to :subject
   

end
