class Section < ActiveRecord::Base
  
  attr_accessible :title, :seq, :quiz_bank_id
  
  validates :title, :presence => true, :length => { minimum: 5, maximum: 50 }
  
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
end
