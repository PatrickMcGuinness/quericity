class QuizBank < ActiveRecord::Base
  

  attr_accessible :description, :title, :repository_id
  validates :title, :presence => true, :uniqueness => true,:length => { minimum: 5 }
  after_create :create_section 

  belongs_to :repository
  has_many :sections, dependent: :destroy

  has_many :question_topics, dependent: :destroy
  has_many :topics, :through => :question_topics
  
  def self.search(search,user)
    quiz_banks = QuizBank.joins("Left outer join repositories on repositories.id = quiz_banks.repository_id left outer join user_repositories on user_repositories.repository_id = repositories.id left outer join users on users.id = user_repositories.user_id").where("users.id = ?",user.id)
    #quiz_banks = QuizBank.joins("Left outer join repositories on  repositories.id = quiz_banks.repository_id Left outer join users on repositories.user_id = users.id").where("users.id = ?",user.id)
	  if search
	    quiz_banks.where('quiz_banks.title ILIKE ? or quiz_banks.description ILIKE ?', "%#{search}%","%#{search}%")
	  else
	    quiz_banks
	  end
  end

  def create_section
    self.sections.create(:title => "Default Section")
  end

end
