class Question < ActiveRecord::Base
  
  attr_accessible :seq,:description,:question_type,:difficulty_level,:reference_url,:section_id,:default_score
  
  validates :description, :section_id, :question_type,:presence => true
  
  belongs_to :section, :counter_cache => true
  has_many :question_options, dependent: :destroy

  default_scope { where("deleted_at IS NULL") }

  class Difficulty
    EASY = 1
    MEDIUM = 2
    DIFFICULT = 3
    def self.get_all_difficulties
      [["Easy",1],["Medium",2],["Difficult",3]]
    end
  end

  class QuestionType
    TRUEFALSE = 1
    MCQ = 2
    OPENENDED = 3
    BLANK = 4
    def self.get_all_question_types
      [["True False",1],["MCQ",2],["Open Ended",3],["Fill In Blank",4]]
    end
  end

  

  def self.find_by_list(list)
    Question.where("id in (?)",list).order("seq ASC")
  end
  def is_easy?
    self.difficulty_level == Question::Difficulty::EASY
  end

  def is_medium?
    self.difficulty_level == Question::Difficulty::MEDIUM
  end

  def is_difficult?
    self.difficulty_level == Question::Difficulty::DIFFICULT
  end

  def is_true_false?
   self.question_type == Question::QuestionType::TRUEFALSE
  end

  def is_mcq?
    self.question_type == Question::QuestionType::MCQ
  end

  def is_open_ended?
    self.question_type == Question::QuestionType::OPENENDED
  end

  def is_fill_in_the_blank?
    self.question_type == Question::QuestionType::BLANK
  end

  def self.difficulty_for_select
    Question::Difficulty.get_all_difficulties
  end

  def self.types_for_select
    Question::QuestionType.get_all_question_types
  end

  def clone_the_question(new_section)
    new_question = new_section.questions.create(:seq => self.seq, :description => self.description,
      :question_type => self.question_type, :difficulty_level => self.difficulty_level,
       :section_id => self.section_id)
    self.question_options.each do |question_option|
      question_option.clone_the_question_option(new_question)
    end
  end

  def self.create_the_question(section,params)
    question = section.questions.create(params[:question])
    params[:question_options].each do |question_option|
      QuestionOption.create(answer: question_option[:answer],
                      is_correct: question_option[:is_correct],
                      question_id: question.id, seq: question_option[:seq])
    end
    question
  end

  def update_question(params)
    if params[:question_type] == Question::QuestionType::MCQ
      self.question_options.destroy_all
      params[:question_options].each do |question_option|
        QuestionOption.create(answer: question_option[:answer],
                      is_correct: question_option[:is_correct],
                      question_id: question_option[:question_id],
                      seq: question_option[:seq])
      end
    else 
      params[:question_options].each do |question_option|
        QuestionOption.find(question_option[:id]).update_attributes(answer: question_option[:answer],
                                                              is_correct: question_option[:is_correct],
                                                              question_id:question_option[:question_id],
                                                              seq: question_option[:seq])
      end
    end  
    self.update_attributes(params[:question])
  end
  
  
  
  def get_first_description
    description = self.description
    temp = description.split("_")
    temp[0]
  end
  def get_second_description
    description = self.description
    temp = description.split("_")
    length = temp.length - 1
    temp[length]
  end

  def self.change_question_positions(questions)
    questions.each_with_index do |id, index|
      Question.update_all({seq: index+1},{id: id})
    end
    questions = Question.find_by_list(questions)
    section = questions.first.section
    [questions,section]
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :seq => seq,
      :description => description,
      :question_type => question_type,
      :difficulty_level => difficulty_level,
      :reference_url => reference_url,
      :section_id => section_id,
      :default_score => default_score,
      :question_options => self.question_options.order("seq ASC").as_json()
    }
  end
   
end
