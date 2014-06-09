class Topic < ActiveRecord::Base
  attr_accessible :title

  validates :title, :presence => true, :uniqueness => true

  has_many :question_topics
  
  has_many :quiz_banks, :through => :question_topics

  def self.search(search)
    topics = Topic.where('title ILIKE ?', "#{search}%")
    topic_with_text = []
    topics.each do |topic|
    	topic_with_text.push({text: topic.title})
    end
    topic_with_text
  end
end
