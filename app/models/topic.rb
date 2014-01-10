class Topic < ActiveRecord::Base
  attr_accessible :title

  validates :title, :presence => true, :uniqueness => true

  has_many :question_topics
  
  has_many :quiz_banks, :through => :question_topics

  def self.search(search)
    Topic.where('title ILIKE ?', "%#{search}%")
  end
end
