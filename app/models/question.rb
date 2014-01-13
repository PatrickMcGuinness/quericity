class Question < ActiveRecord::Base
  attr_accessible :subject_id,:seq,:description,:question_type,:difficulty_level,:reference_url,:section_id,:question_options_attributes
  validates :subject_id, :description, :section_id, :difficulty_level, :question_type, :presence => true
  belongs_to :section
  belongs_to :subject

  has_many :question_options

  accepts_nested_attributes_for :question_options

  class Difficulty
    EASY = 1
    MEDIUM = 2
    DIFFICULT = 3
    def self.get_all_difficulties
      [["Easy",1],["Medium",2],["Difficulty",3]]
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
    question = section.questions.new(params[:question])
    question.description = params[:description][0]
    question.save
    question
  end
  
  def create_true_false_option(params)
    question_option = self.question_options.new
    question_option.is_correct = true if params["truefalse"] == "on"
    question_option.is_correct = false unless params["truefalse"] == "on" 
    question_option.save
    question_option
  end
  
  def self.create_open_ended(params,section)
    question = section.questions.new(params[:question])
    question.description = params[:description][0]
    question.save
    question
  end

  def create_open_ended_option(params)
    question_option = self.question_options.new
    question_option.answer = params[:answer][0]
    question_option.save 
    question_option
  end
  
  def self.create_fill_in_the_blank(params,section)
    description = "#{params[:question][:description]} _____ #{params[:question][:description2]}" 
    question = section.questions.new(:subject_id => params[:question][:subject_id],:difficulty_level => params[:question][:difficulty_level],
                                    :question_type => params[:question][:question_type], :description => description)
    question.save
    question
  end

  def create_fill_in_the_blank_option(params)
    question_option = self.question_options.create(params[:question_options])
    question_option
  end
  def self.create_question(params,section)
    if params[:question][:question_type] == '1'
      question = Question.create_true_false(params,section)
    end
    if params[:question][:question_type] == '2'
    end
    if params[:question][:question_type] == '3'
      puts "@@@@@@@@@@@@@@@@@@ in open ended"
      question = Question.create_open_ended(params,section)
    end
    if params[:question][:question_type] == '4'
      question = Question.create_fill_in_the_blank(params,section)
    end
    question
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
    question_option
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
    self.question_type == Question::QuestioType::MCQ
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

   
end
