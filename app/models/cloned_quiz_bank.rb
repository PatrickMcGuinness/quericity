class ClonedQuizBank < ActiveRecord::Base
  attr_accessible :description,:repository_id, :quiz_bank_id, :title, :subject_id, :instructions

  validates :quiz_bank_id, presence: true
  validates :title, presence:true
  validates :subject_id, presence:true 

  belongs_to :quiz_bank
  belongs_to :subject
  has_many :cloned_sections, dependent: :destroy

  def self.create_the_clone(quiz_bank)
  	cloned_quiz_bank = ClonedQuizBank.create(:description => quiz_bank.description, 
  												:repository_id => quiz_bank.repository_id, :quiz_bank_id => quiz_bank.id,
  												:title => quiz_bank.title, :subject_id => quiz_bank.subject.id,
  												:instructions => quiz_bank.instructions)
  	ClonedSection.create_the_clone(cloned_quiz_bank)
  	cloned_quiz_bank
  end

end
