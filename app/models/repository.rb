class Repository < ActiveRecord::Base
  attr_accessible :description, :title
  validates :title, :presence => true, :length => { minimum: 5 }
  belongs_to :user
  has_many :quiz_banks
end
