class Attempt < ActiveRecord::Base
  attr_accessible :sharing_id, :served_quiz_id

  belongs_to :sharing
  belongs_to :served_quiz

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :served_quiz => served_quiz.as_json(),
      :sharing => sharing.as_json(),
      :score => score
    }
  end
end
