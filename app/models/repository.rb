class Repository < ActiveRecord::Base
  attr_accessible :description, :title
  validates :title, :presence => true, :length => { minimum: 5 }
  
  belongs_to :user
  
  has_many :invitations
  has_many :user_repositories
  has_many :collaborators , :through => :user_repositories , :source => :user
  
  
  has_many :quiz_banks


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
    self.user.id == user.id
  end
  
  def add_collaborator user , permission
    if is_collaborator? user
      user_repo = self.user_repositories.where(:user_id => user.id).first
      user_repo.update_attribute(:permission , permission)
      user_repo
    else
      UserRepository.create(:repository_id => self.id , :user_id => user.id , :permission => permission)
    end  
  end
end
