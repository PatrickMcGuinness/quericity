class Repository < ActiveRecord::Base
  
  paginates_per 20
  
  #extend FriendlyId
  #friendly_id :title, use: :slugged

  attr_accessible :description, :title,:public
  validates :title, :presence => true, :length => { minimum: 5 }
  
  has_many :users, :through => :user_repositories 
  has_many :invitations
  has_many :user_repositories, dependent: :destroy
  has_many :collaborators , :through => :user_repositories , :source => :user 
  has_many :quiz_banks, dependent: :destroy

  default_scope { where("deleted_at IS NULL") }


  class Public
    NO = 0
    YES = 1
  end

  def is_public?
    self.public == Repository::Public::YES
  end

  def owner
    self.user_repositories.find_by_permission("Owner").user
  end
  def is_collaborator? user
    self.collaborators.where(:id => user.id).present?
  end
  
  def is_admin? user
    self.user_repositories.where(:user_id => user.id , :permission => 'Admin').present?
  end
  
  def can_write? user
    self.user_repositories.where(:user_id => user.id , :permission => 'Write').present?
  end

  def is_owner? user
    self.user_repositories.where(:user_id => user.id , :permission => 'Owner').present?
  end

  def self.for_select(user)
    user.can_change_repositories.map{|r| [r.title, r.id]}
  end

  def question_tags
    quiz_banks_ids = QuizBank.where("repository_id = ?",self.id).pluck(:id)
    QuestionTopic.where("quiz_bank_id IN (?)",quiz_banks_ids) 
  end

  def make_public
    self.update_attribute(:public, Repository::Public::YES)
    all_teachers = User.select{|u| u.is_professor?}.map(&:id)
  end
  #def add_collaborator user , permission
    #if is_collaborator? user
      #user_repo = self.user_repositories.where(:user_id => user.id).first
      #user_repo.update_attribute(:permission , permission)
      #user_repo
    #else
      #UserRepository.create(:repository_id => self.id , :user_id => user.id , :permission => permission)
    #end  
  #end
end
