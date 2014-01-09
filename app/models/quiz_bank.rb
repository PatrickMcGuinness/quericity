class QuizBank < ActiveRecord::Base
  attr_accessible :description, :title, :repository_id
  validates :title, :presence => true, :uniqueness => true,:length => { minimum: 5 }
  belongs_to :repository
  has_many :sections, dependent: :destroy
  
  def self.search(search,user)
    quiz_banks = QuizBank.joins("Left outer join repositories on  repositories.id = quiz_banks.repository_id Left outer join users on repositories.user_id = users.id").where("users.id = ?",user.id)
	  if search
	    quiz_banks.where('quiz_banks.title ILIKE ? or quiz_banks.description ILIKE ?', "%#{search}%","%#{search}%")
	  else
	    quiz_banks
	  end
  end

end
