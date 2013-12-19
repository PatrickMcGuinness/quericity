class QuizBank < ActiveRecord::Base
  attr_accessible :description, :title
  
  belongs_to :repository
end
