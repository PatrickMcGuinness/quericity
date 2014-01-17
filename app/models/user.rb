class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :first_name, :last_name,:profile_pic, :role, :encrypted_password,:reset_password_token, :reset_password_sent_at, :remember_created_at,
  :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip,:confirmation_token,
  :confirmed_at, :confirmation_sent_at, :unconfirmed_email
  
  has_many :repositories, :through => :user_repositories
  has_many :user_repositories, dependent: :destroy 
  
  mount_uploader :profile_pic, ImageUploader

  def name
    "#{self.first_name} #{self.last_name}"
  end
  def any_repository_present?
    self.repositories.count > 0
  end

  def own_repositories
    Repository.joins(:user_repositories).where("user_id = ? and permission = ?",self.id,"Owner")
  end

  def shared_repositories
    Repository.joins(:user_repositories).where("user_id = ? and permission != ?", self.id,"Owner")
  end

  def can_change_repositories
    Repository.joins(:user_repositories).where("user_id = ? and permission IN (?)",self.id, ["Owner","Write","Admin"])
  end

  def can_change_repo?(repo)
    self.user_repositories.find_by_repository_id(repo.id).permission != "Read"
  end
end
