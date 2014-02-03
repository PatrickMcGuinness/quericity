class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable,
  # :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :role, :invited_by
  attr_accessible :first_name, :last_name,:profile_pic, :role, :encrypted_password,:reset_password_token, :reset_password_sent_at, :remember_created_at,
  :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip,:confirmation_token,
  :confirmed_at, :confirmation_sent_at, :unconfirmed_email
  
  has_many :repositories, :through => :user_repositories
  has_many :user_repositories, dependent: :destroy 
  has_many :owned_sharings, :class_name => 'Sharing', :foreign_key => 'owner_id'
  has_many :groups, :class_name => 'Group', :foreign_key => 'owner_id'  
  has_many :student_groups, :class_name => 'StudentGroup', :foreign_key => 'student_id'
  has_many :invites, :class_name => "Invite", :foreign_key => "sender_id"
  mount_uploader :profile_pic, ImageUploader

  after_create :create_default_group

  def create_default_group
    self.groups.create(:title => "default") if self.is_professor?
  end

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

  def quiz_banks
    repo_ids = self.repositories.pluck(:id)
    QuizBank.where("repository_id IN (?)", repo_ids)
  end

  def is_student?
    self.role == "Student"
  end

  def is_professor?
    self.role == "Professor"
  end

  def contacts
    group_ids = self.groups.pluck(:id)
    Contact.joins(:group_contacts).where("group_contacts.group_id IN (?)",group_ids)
  end

  def default_group
    self.groups.find_by_title("default")
  end

  def groups_to_show
    self.groups.where("title != 'default'")
  end


  def students
    group_ids = self.groups.pluck(:id)
    student_ids = StudentGroup.where("group_id IN (?)",group_ids).pluck(:student_id)
    User.where("id IN (?)", student_ids)
  end
end
