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
    question = section.questions.create(params[:question])
    question
  end

  def self.create_mcq(params,section)
    question = section.questions.create(params[:question])
    question
  end
  def create_mcq_option(params)
    params["options"].to_i.times.each do |i|
      question_option = self.question_options.new
      question_option.answer = params["answer#{i+1}"]
      question_option.is_correct = true if params["option#{i+1}"] == "on"
      question_option.is_correct = false unless params["option#{i+1}"] == "on"
      question_option.save
    end
  end

  def create_true_false_option(params)
    question_option = self.question_options.new
    question_option.is_correct = true if params["truefalse"] == "on"
    question_option.is_correct = false unless params["truefalse"] == "on" 
    question_option.save
    question_option
  end
  
  def self.create_open_ended(params,section)
    question = section.questions.create(params[:question])
    question
  end

  def create_open_ended_option(params)
    question_option = self.question_options.new
    question_option.answer = params[:answer]
    question_option.save 
    question_option
  end
  
  def self.create_fill_in_the_blank(params,section)
    #params[:description][0].gsub!("\n","")
    #params[:description][0].gsub!("\r","")
    #params[:description][0].gsub!("</p>","")
    #params[:description2][0].gsub!("<p>","")
    description = "#{params[:description]} _______ #{params[:description2]}" 
    question = section.questions.new(:subject_id => params[:question][:subject_id],:difficulty_level => params[:question][:difficulty_level],
                                    :question_type => params[:question][:question_type], :description => description)
    question.save
    question
  end

  def create_fill_in_the_blank_option(params)
    question_option = self.question_options.new
    question_option.answer = params[:answer]
    question_option.save
    question_option
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
      option.is_correct = true if params["truefalse"] == "on"
      option.is_correct = false unless params["truefalse"] == "on"
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
      description = "#{params[:description]} _______ #{params[:description2]}" 
      self.update_attributes(:subject_id => params[:question][:subject_id],:difficulty_level => params[:question][:difficulty_level],
                                    :question_type => params[:question][:question_type], :description => description)
      self.question_options.first.answer = params[:answer]
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

   
end
