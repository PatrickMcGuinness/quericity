class StudentInvitation < ActiveRecord::Base
  attr_accessible :email, :quiz_bank_id, :sharing_id
  validates :email, presence: true
  validates :quiz_bank_id, presence: true
  validates :sharing_id, presence: true 

  belongs_to :quiz_bank
  belongs_to :sharing
end
