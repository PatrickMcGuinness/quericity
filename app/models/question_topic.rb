class QuestionTopic < ActiveRecord::Base
  attr_accessible :quiz_bank_id, :topic_id
  validates :quiz_bank_id, :presence => true
  validates :topic_id, :presence => true
  
  belongs_to :quiz_bank
  belongs_to :topic

  def self.create_topics(tags,quiz_bank)
    tags.each do |t|
      unless Topic.exists?(:title => t.downcase)
        topic = Topic.create(:title => t.downcase)
        QuestionTopic.create(:topic_id => topic.id, :quiz_bank_id => quiz_bank.id)
      else
        topic = Topic.find_by_title(t.downcase)
        unless quiz_bank.question_topics.exists?(:topic_id => topic.id)
          QuestionTopic.create(:quiz_bank_id => quiz_bank.id, :topic_id => topic.id)
        end
      end
    end
  end
  def self.parsestring(tagstring)
    tags = tagstring.split(",")
    tags
  end
  def self.add_tags(tagstring,quiz_bank)
    tags = QuestionTopic.parsestring(tagstring)
    QuestionTopic.create_topics(tags,quiz_bank)
  end
end
