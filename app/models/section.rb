class Section < ActiveRecord::Base
   attr_accessible :title, :seq, :quiz_bank_id
   validates :title, :presence => true, :length => { minimum: 5, maximum: 50 }
   belongs_to :quiz_bank
   has_many :questions
end
