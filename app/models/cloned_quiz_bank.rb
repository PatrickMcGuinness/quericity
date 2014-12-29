class ClonedQuizBank < ActiveRecord::Base
  attr_accessible :description,:repository_id, :quiz_bank_id, :title, :subject, :instructions

  validates :quiz_bank_id, presence: true
  validates :title, presence:true 

  belongs_to :quiz_bank
  has_many :cloned_sections, dependent: :destroy
  has_many :cloned_questions, dependent: :destroy

  def self.create_the_clone(quiz_bank)
  	cloned_quiz_bank = ClonedQuizBank.create(:description => quiz_bank.description, 
  												:repository_id => quiz_bank.repository_id, :quiz_bank_id => quiz_bank.id,
  												:title => quiz_bank.title, :subject => quiz_bank.subject,
  												:instructions => quiz_bank.instructions)
  	cloned_quiz_bank
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :created_at => created_at,
      :updated_at => updated_at,
      :description => description,
      :repository_id => repository_id,
      :quiz_bank_id => quiz_bank_id, 
      :title => title, 
      :subject => subject,
      :instructions => instructions,
    }
    
  end

end
