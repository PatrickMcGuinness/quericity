class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable,
  # :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable,:omniauthable, :omniauth_providers => [:facebook]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :role, :school, :invited_by, :provider, :uid,:time_zone, :show_tour, :show_tooltip
  attr_accessible :first_name, :last_name,:profile_pic, :role, :school, :encrypted_password,:reset_password_token, :reset_password_sent_at, :remember_created_at,
  :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip,:confirmation_token,
  :confirmed_at, :confirmation_sent_at, :unconfirmed_email, :terms_accepted
  
  has_many :repositories, dependent: :destroy 
  has_many :served_quizzes, :class_name => 'ServedQuiz', :foreign_key => 'owner_id'
  has_many :groups, :class_name => 'Group', :foreign_key => 'owner_id'  
  has_many :student_groups, :class_name => 'StudentGroup', :foreign_key => 'student_id'
  has_many :invites, :class_name => "Invite", :foreign_key => "sender_id"
  has_many :sharings
  has_many :answers, :class_name => 'Answer', :foreign_key => 'student_id'

  has_many :shares, :class_name => 'Share', :foreign_key => 'owner_id'

  has_many :shared_withs, :class_name => 'Share', :foreign_key => 'teacher_id'

  has_many :favourite_quiz_banks, dependent: :destroy

  has_many :favourite_quizzes, through: :favourite_quiz_banks, :source => :quiz_bank
  
  mount_uploader :profile_pic, ImageUploader

  after_create :create_default_group
  after_create :create_default_repo
  after_create :confirm_the_user

  #validates :terms_accepted, presence: true
  #validates :last_name, presence: true
  #validates :email, presence: true
  #validates :password, presence: true
  #validates :role, presence: true
  #validates :email, uniqueness: true  


  

  def create_default_group
    self.groups.create(:title => "default") if self.is_professor?
  end

  def create_default_repo
    self.repositories.create(:title => Repository::DefaultRepo::NAME) if self.is_professor?
  end

  def get_details
    common = {student: self.as_json(),quizzes_data: []}
    self.student_served_quizzes.each do |served_quiz|
      common[:quizzes_data].push({served_quiz: served_quiz.as_json(),attempted_answers: Answer.student_answers_in_served_quiz(served_quiz,self).as_json(),
        correct_answers: Answer.student_correct_answers(served_quiz,self).as_json(), 
        wrong_answers: Answer.student_wrong_answers(served_quiz,self).as_json(), 
        status: Sharing.where("user_id = ? and served_quiz_id = ?",self.id,served_quiz.id).first.as_json(),
        graded_answers: served_quiz.graded_answers.where("student_id = ?",self.id)})
    end
    common
  end


  def confirm_the_user
    if self.provider.present?
      self.confirmed_at = Time.now
      self.confirmation_token = nil
      self.save
    end
  end

  def name
    "#{self.first_name} #{self.last_name}"
  end
  
  def any_repository_present?
    self.repositories.present?
  end


  def get_average
    self.sharings.map{|s| s.get_average}.blank? ? 0 : self.sharings.map{|s| s.get_average}.inject(:+)/self.sharings.count
  end

  def quiz_banks
    repo_ids = self.repositories.pluck(:id)
    QuizBank.where("repository_id IN (?) and status = ?", repo_ids, QuizBank::Status::SAVED)
  end
  
  def favourite_quiz_banks_to_show
    #self.favourite_quiz_banks.joins(:quiz_bank).where("quiz_banks.deleted_at IS NULL")
    quiz_banks = QuizBank.joins(:favourite_quiz_banks).where("quiz_banks.deleted_at IS NULL and favourite_quiz_banks.user_id = ?",self.id)
    QuizBank.make_json_for_list(quiz_banks,self)
  end

  def student_served_quizzes
    sharing_ids = self.sharings.pluck(:id)
    ServedQuiz.joins(:sharings).where("sharings.id IN (?)",sharing_ids)
  end

  def student_pending_quizzes
    sharing_ids = self.sharings.where("status = ?",Sharing::Status::PENDING)
    ServedQuiz.joins(:sharings).where("sharings.id IN (?)",sharing_ids)
  end

  def student_mixed_quizzes
    sharing_ids = self.sharings.where("status = ? OR status = ?",Sharing::Status::STARTED , Sharing::Status::PENDING)
    ServedQuiz.joins(:sharings).where("sharings.id IN (?)",sharing_ids)
  end

  def student_started_quizzes
    sharing_ids = self.sharings.where("status = ?",Sharing::Status::STARTED)
    ServedQuiz.joins(:sharings).where("sharings.id IN (?)",sharing_ids)
  end

  def student_attempted_quizzes
    sharing_ids = self.sharings.where("status = ?",Sharing::Status::ATTEMPTED)
    ServedQuiz.joins(:sharings).where("sharings.id IN (?)",sharing_ids)
  end

  def bar_graph_data
    common = {quizzes: [],names:[],maxscores:[]}
    self.student_attempted_quizzes.each do |quiz|
      common[:quizzes].push(Answer.student_correct_answers(quiz,self).count)
      common[:names].push(quiz.cloned_quiz_bank.title)
      common[:maxscores].push(quiz.cloned_quiz_bank.cloned_questions.length)
    end
    common
  end

  def line_graph_data
    {quizzes: self.sharings.map{|s| s.get_average}} 
  end

  def repo_quiz_banks(params)
    quiz_banks = self.repositories.find(params[:id]).quiz_banks.where("status = ?",QuizBank::Status::SAVED)
    QuizBank.make_json_for_list(quiz_banks,self)
  end


  def shared_quiz_banks
    quiz_banks = QuizBank.joins("Left outer join shares on shares.shareable_id = quiz_banks.id").where("quiz_banks.public = ? OR shares.teacher_id = ? OR shares.owner_id = ?",QuizBank::Public::YES, self.id, self.id)
    QuizBank.make_json_for_list(quiz_banks,self)
  end

  def is_owner_of_quiz_bank?(quiz_bank)
    self.repositories.find(quiz_bank.repository_id).present?
  end


  def search_served_quizzes(params)
    quiz_ids = self.quiz_banks.search(params[:q]).result(:distinct => true).pluck(:id)
    ServedQuiz.where("quiz_bank_id IN (?)",quiz_ids)
  end

  def is_student?
    self.role == "Student"
  end

  def is_professor?
    self.role == "Professor"
  end

  def default_group
    self.groups.find_by_title("default")
  end

  def default_repo
    self.repositories.find_by_title(Repository::DefaultRepo::NAME)
  end

  def groups_to_show
    self.groups.where("title != 'default'")
  end

  def students
    group_ids = self.groups.pluck(:id)
    student_ids = StudentGroup.where("group_id IN (?)",group_ids).pluck(:student_id)
    User.where("id IN (?)", student_ids)
  end

  def served_students
    served_quiz_ids = self.served_quizzes.pluck(:id)
    users = User.joins(:sharings).where("served_quiz_id IN (?)",served_quiz_ids).uniq unless served_quiz_ids.blank? 
    users = [] if served_quiz_ids.blank?
    users 
  end

  def self.search_by_name(search)
    User.where('role = ? and first_name ILIKE ?', "Student","%#{search}%").limit(5)
  end

  def self.search_teacher_by_email(search,user)
    teachers = User.where('role = ? and email ILIKE ?',"Professor", "%#{search}%").limit(5)
    email_with_text = []
    teachers.each do |teacher|
      email_with_text.push({text: teacher.email})
    end
    email_with_text
  end

  def display_picture
    if self.provider == "facebook" && self.uid
      return "http://graph.facebook.com/#{self.uid}/picture?type=large"
    elsif self.profile_pic.url
      return {url:self.profile_pic.url}
    else
      return {url: "/assets/img_01.png"}
    end
  end

  def as_json(opts = nil)
    opts ||={}
    {

      :id  => id,
      :email => email, 
      :role => role, 
      :school => school,
      :invited_by => invited_by, 
      :provider => provider, 
      :uid => uid,
      :first_name => first_name,
      :last_name => last_name,
      :profile_pic => display_picture.as_json(),
      :time_zone => time_zone.to_s,
      :show_tooltip => show_tooltip,
      :show_tour => show_tour
    }
    
  end

  def self.find_for_facebook_oauth(auth)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first  || User.where(:email => auth.info.email ).first
    unless user
      user = User.new
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      #user.profile_pic = auth.info.image # assuming the user model has an image
    end
    user
  end
end
