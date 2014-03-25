class QuestionTopic < ActiveRecord::Base
  attr_accessible :quiz_bank_id, :topic_id
  validates :quiz_bank_id, :presence => true
  validates :topic_id, :presence => true
  
  belongs_to :quiz_bank
  belongs_to :topic

  def self.create_topic(title,quiz_bank)
    unless Topic.exists?(:title => title.downcase)
      topic = Topic.create(:title => title.downcase)
      QuestionTopic.create(:topic_id => topic.id, :quiz_bank_id => quiz_bank.id)
    else
      topic = Topic.find_by_title(title.downcase)
      unless quiz_bank.question_topics.exists?(:topic_id => topic.id)
        QuestionTopic.create(:quiz_bank_id => quiz_bank.id, :topic_id => topic.id)
      end
    end
  end
end
