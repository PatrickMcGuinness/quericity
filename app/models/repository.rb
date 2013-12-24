class Repository < ActiveRecord::Base
  attr_accessible :description, :title
  validates :title, :presence => true, :length => { minimum: 5 }
  
  belongs_to :user
  
  has_many :user_repositories
  has_many :collaborators , :through => :user_repositories , :source => :user
  
  has_many :quiz_banks
  
  def is_collaborator? user
    self.collaborators.where(:user_id => user.id).present?
  end
  
  def add_collaborator user , permission
    UserRepository.create(:repository_id => self.id , :user_id => user.id , :permission => permission)
  end

end
