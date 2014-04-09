class Repository < ActiveRecord::Base
  
  paginates_per 20
  
  #extend FriendlyId
  #friendly_id :title, use: :slugged

  attr_accessible :title,:user_id
  validates :title, :presence => true
  
  belongs_to :user  
  has_many :quiz_banks, dependent: :destroy

  default_scope { where("deleted_at IS NULL") }


  class Public
    NO = 0
    YES = 1
  end

  class DefaultRepo
    NAME = "Main"
  end

  def is_public?
    self.public == Repository::Public::YES
  end

  def owner
    self.user
  end

  def self.for_select(user)
    user.repositories.map{|r| [r.title, r.id]}
  end

  def question_tags
    quiz_banks_ids = QuizBank.where("repository_id = ?",self.id).pluck(:id)
    QuestionTopic.where("quiz_bank_id IN (?)",quiz_banks_ids) 
  end

  def make_public
    self.update_attribute(:public, Repository::Public::YES)
    all_teachers = User.select{|u| u.is_professor?}.map(&:id)
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :title   => title,
      :created_at => created_at,
      :updated_at => updated_at,
      :quiz_banks => quiz_banks.as_json(),
      :user => user.as_json()
    }
  end
end
