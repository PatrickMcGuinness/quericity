class QuizBank < ActiveRecord::Base
  

  attr_accessible :description, :title, :repository_id, :subject_id
  validates :title,:repository_id,:subject_id, :presence => true
  after_create :create_section 

  belongs_to :repository
  belongs_to :subject
  has_many :sections, dependent: :destroy

  has_many :question_topics, dependent: :destroy
  has_many :topics, :through => :question_topics
  
  def self.search(search,user)
    quiz_banks = QuizBank.joins("Left outer join repositories on repositories.id = quiz_banks.repository_id left outer join user_repositories on user_repositories.repository_id = repositories.id left outer join users on users.id = user_repositories.user_id").where("users.id = ?",user.id)
	  if search
	    quiz_banks = quiz_banks.where('quiz_banks.title ILIKE ? or quiz_banks.description ILIKE ?', "%#{search}%","%#{search}%")
	  else
	    quiz_banks
	  end
    quiz_banks
  end

  def create_section
    self.sections.create(:title => "Default Section")
  end

end
