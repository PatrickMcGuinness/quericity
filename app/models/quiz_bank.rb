class QuizBank < ActiveRecord::Base
  
  paginates_per 20

  #extend FriendlyId
  #friendly_id :title, use: :slugged
  
  attr_accessible :description, :title, :repository_id, :subject, :instructions,:public,:status
  validates :title,:repository_id,:presence => true 

  belongs_to :repository, :counter_cache => true
  
  has_many :sections, dependent: :destroy
  has_many :question_topics, dependent: :destroy
  has_many :topics, :through => :question_topics
  has_many :served_quizzes
  has_many :invites, as: :invitable
  has_many :shares, as: :shareable 
  has_many :favourite_quiz_banks, dependent: :destroy
  has_many :cloned_quiz_banks, dependent: :destroy

  after_create :create_section
  
  default_scope { where("deleted_at IS NULL") }

  class Public
    YES = 1
    NO = 0
  end

  class Status
    SAVED = 1
    NOTSAVED = 0
  end

  def is_public?
    self.public == QuizBank::Public::YES
  end

  def self.quiz_banks_list(user)
    quiz_banks_list = user.quiz_banks.where("status = ?",QuizBank::Status::SAVED)
    repository_ids = user.repositories.pluck(:id)
    quiz_banks_list = quiz_banks_list + QuizBank.where("repository_id NOT IN (?) and public = ?",repository_ids, QuizBank::Public::YES)
    quiz_banks_list
  end

  def is_favourite?(user)
    user.favourite_quiz_banks.find_by_quiz_bank_id(self.id).present?
  end

  def is_user_quiz_bank?(user)
    user.quiz_banks.find(self.id).present?
  end    

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

  def clone_the_quiz(user)
    new_quiz_bank = user.quiz_banks.create(:title => self.title, :description => self.description,
      :repository_id => user.default_repo.id, subject: self.subject,public: 0, instructions: self.instructions)
    self.sections.each do |section|
      section.clone_the_section(new_quiz_bank)
    end
    self.question_topics.each do |question_topic|
      question_topic.clone_the_question_topic(new_quiz_bank)
    end
    new_quiz_bank
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :title   => title,
      :description  => description,
      :repository_id => repository_id,
      :subject => subject,
      :instructions => instructions,
      :public => public,
      :status => status,
      :created_at => created_at,
      :updated_at => updated_at,
      :question_topics => question_topics.as_json(),
      :topics => topics.as_json(),
      :user => owner.as_json(),
      :sections => sections.as_json()
      #:artist => artist.as_json()
      #attr_accessible :description, :title, :repository_id, :subject, :instructions,:public,:status
    }
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
