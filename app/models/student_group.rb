class StudentGroup < ActiveRecord::Base
  attr_accessible :student_id, :group_id
  validates :student_id, presence: true
  validates :group_id, presence: true

  belongs_to :group
  belongs_to :student, :class_name=>'User', :foreign_key=>'student_id'
end
