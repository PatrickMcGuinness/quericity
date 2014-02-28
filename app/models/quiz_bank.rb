class QuizBank < ActiveRecord::Base
  
  paginates_per 20

  #extend FriendlyId
  #friendly_id :title, use: :slugged
  
  attr_accessible :description, :title, :repository_id, :subject_id, :instructions
  validates :title,:repository_id,:subject_id, :presence => true 

  belongs_to :repository, :counter_cache => true
  belongs_to :subject
  
  has_many :sections, dependent: :destroy
  has_many :question_topics, dependent: :destroy
  has_many :topics, :through => :question_topics
  has_many :served_quizzes
  has_many :invites, as: :invitable 

  after_create :create_section
  
  default_scope { where("deleted_at IS NULL") }

  def create_section
    self.sections.create(:title => "Default Section")
  end

  def default_section
    self.sections.find_by_title("Default Section")
  end

  def questions
    section_ids = self.sections.pluck(:id)
    Question.where("section_id IN (?)",section_ids)
  end

  def owner
    self.repository.owner
  end

  def json_for_update_quiz_bank
    common = {quiz_bank: self,question_topics: []}
    self.question_topics.each do |question_topic|
      common[:question_topics] << {id: question_topic.id, title: question_topic.topic.title}
    end
    common
  end

  def update_tags(question_topics)
    tags = []
    QuizBank.transaction do
      self.question_topics.destroy_all
      topic_arrays = question_topics.split(",")
      topic_arrays.each do |question_topic|
        topic = Topic.find_by_title(question_topic)
        if topic.blank?
          topic = Topic.create(:title => question_topic)
        end
        tags << self.question_topics.create(:topic_id => topic.id)
      end
    end
    tags
  end

end
