class Attempt < ActiveRecord::Base
  attr_accessible :sharing_id, :served_quiz_id

  belongs_to :sharing
  belongs_to :served_quiz
end
