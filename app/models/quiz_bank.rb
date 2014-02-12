class QuizBank < ActiveRecord::Base
  
  paginates_per 5
  
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

end
