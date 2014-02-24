class Question < ActiveRecord::Base
  
  attr_accessible :seq,:description,:question_type,:difficulty_level,:reference_url,:section_id
  validates :description, :section_id, :difficulty_level, :question_type, :presence => true
  
  belongs_to :section, :counter_cache => true
  has_many :question_options

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
  
  def self.create_true_false(params,section)
    section.questions.create(params[:question])
  end

  def self.create_mcq(params,section)
    section.questions.create(params[:question])
  end
  def create_mcq_option(params)
    params["options"].to_i.times.each do |i|
      unless params["answer#{i+1}"].blank?
        question_option = self.question_options.new
        question_option.answer = params["answer#{i+1}"]
        question_option.is_correct = true if params[:option] == "option#{i+1}"
        question_option.is_correct = false unless params[:option] == "option#{i+1}"
        question_option.save
      end
    end
  end

  def create_true_false_option(params)
    question_option = self.question_options.new
    question_option.is_correct = true if params["truequestion"] == "on"
    question_option.is_correct = false if params["falsequestion"] == "on" 
    question_option.save
    question_option
  end
  
  def self.create_open_ended(params,section)
    section.questions.create(params[:question])
  end

  def create_open_ended_option(params)
    self.question_options.create(:answer => params[:answer]) 
  end
  
  def self.create_fill_in_the_blank(params,section)
    description = "#{params[:question][:description]} _______ #{params[:description2][:info]}" 
    question = section.questions.new(:difficulty_level => params[:question][:difficulty_level],
                                    :question_type => params[:question][:question_type], :description => description)
    question.save
    question
  end

  def create_fill_in_the_blank_option(params)
    question_option = self.question_options.create(:answer => params[:answer])
  end
  def self.create_question(params,section)
    if params[:question][:question_type] == '1'
      question = Question.create_true_false(params,section)
    end
    if params[:question][:question_type] == '2'
      question = Question.create_mcq(params,section)
    end
    if params[:question][:question_type] == '3'
      question = Question.create_open_ended(params,section)
    end
    if params[:question][:question_type] == '4'
      question = Question.create_fill_in_the_blank(params,section)
    end
    question
  end

  def update_question(params)
    if self.is_true_false?
      self.update_attributes(params[:question])
      option = self.question_options.first
      option.is_correct = true if params["truequestion"] == "on"
      option.is_correct = false if params["falsequestion"] == "on"
      option.save
    end
    if self.is_mcq?
      self.update_attributes(params[:question])
      self.question_options.destroy_all
      self.create_mcq_option(params)
    end
    if self.is_open_ended?
      self.update_attributes(params[:question])
      unless self.question_options.first.blank?
        option = self.question_options.first
        option.answer = params[:answer]
        option.save
      end
    end
    if self.is_fill_in_the_blank?
      description = "#{params[:description][:info]} _______ #{params[:description2][:info]}" 
      self.update_attributes(:difficulty_level => params[:question][:difficulty_level],
                                    :question_type => Question::QuestionType::BLANK, :description => description)
      option = self.question_options.first 
      option.answer = params[:answer]
      option.save
    end
    self
  end

  def create_option(params)
    if self.is_true_false?
      question_option = self.create_true_false_option(params)
    end
    if self.is_open_ended?
      question_option = self.create_open_ended_option(params)
    end
    if self.is_fill_in_the_blank?
      question_option = self.create_fill_in_the_blank_option(params)
    end
    if self.is_mcq?
      question_option = self.create_mcq_option(params) 
    end
    question_option
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

  def self.change_question_positions(questions)
    questions.each_with_index do |id, index|
      Question.update_all({seq: index+1},{id: id})
    end
    questions = Question.find_by_list(questions)
    section = questions.first.section
    [questions,section]
  end

   
end
