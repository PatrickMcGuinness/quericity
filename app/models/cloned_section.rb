class ClonedSection < ActiveRecord::Base
  attr_accessible :title, :seq, :cloned_quiz_bank_id
   
  validates :title, presence: true
  validates :cloned_quiz_bank_id, presence: true 

  belongs_to :cloned_quiz_bank
  has_many :cloned_questions, dependent: :destroy


  def self.create_the_clone(cloned_quiz_bank)
    quiz_bank = cloned_quiz_bank.quiz_bank
    quiz_bank.sections.each do |section|
      cloned_section = ClonedSection.create(:title => section.title, :cloned_quiz_bank_id => cloned_quiz_bank.id)
      ClonedQuestion.create_the_clone(section,cloned_section)
    end
  end
end
