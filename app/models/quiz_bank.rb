class QuizBank < ActiveRecord::Base
  
  paginates_per 5
  
  attr_accessible :description, :title, :repository_id, :subject_id
  validates :title,:repository_id,:subject_id, :presence => true
  after_create :create_section 

  belongs_to :repository, :counter_cache => true
  belongs_to :subject
  has_many :sections, dependent: :destroy

  has_many :question_topics, dependent: :destroy
  has_many :topics, :through => :question_topics
  has_many :sharings 
  


  def create_section
    self.sections.create(:title => "Default Section")
  end

end
