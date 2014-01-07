class Section < ActiveRecord::Base
   attr_accessible :title, :seq, :quiz_bank_id
   
   belongs_to :quiz_bank
   has_many :questions
end
