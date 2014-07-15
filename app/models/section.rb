class Section < ActiveRecord::Base
  
  attr_accessible :title, :seq, :quiz_bank_id
  
  validates :title, :quiz_bank_id, presence: true
  #validates :title, :uniqueness => { :scope => :quiz_bank_id }
  
  belongs_to :quiz_bank
  has_many :questions, dependent: :destroy

  default_scope { where("deleted_at IS NULL") }

  def self.all_questions_in_sections(sections)
    section_ids = sections.order("seq ASC").pluck(:id)
    Question.where("section_id IN (?)",section_ids).order("seq ASC")
  end

  def self.change_section_positions(sections)
  	sections.each_with_index do |id, index|
      Section.update_all({seq: index+1},{id: id})
    end
  end

  def clone_the_section(new_quiz_bank)
    new_section = new_quiz_bank.sections.create(:title => self.title, :seq => self.seq)
    self.questions.each do |question|
      question.clone_the_question(new_section)
    end
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :title   => title,
      :quiz_bank_id => quiz_bank_id,
      :created_at => created_at,
      :updated_at => updated_at,
      :questions => self.questions.order("created_at ASC").as_json()
    }
  end
end
