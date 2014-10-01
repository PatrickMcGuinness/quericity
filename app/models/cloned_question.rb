class ClonedQuestion < ActiveRecord::Base
  attr_accessible :seq, :description, :question_type,:difficulty_level,
                  :reference_url,:cloned_section_id, :cloned_quiz_bank_id, :default_score

  has_many :cloned_question_options
  has_many :answers

  belongs_to :cloned_quiz_bank

  validates :description,:question_type, :difficulty_level,:cloned_quiz_bank_id,presence: true

 

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

  def user_answer(user,served_quiz)
    user.answers.where("cloned_question_id = ? and served_quiz_id = ?",self.id,served_quiz.id).first
  end

  def get_correct_answer
    answer = nil
    if self.is_true_false?
      cloned_question_option = self.cloned_question_options.first
      answer = "True" if cloned_question_option.is_correct == true
      answer = "False" unless cloned_question_option.is_correct == true
    end
    if self.is_mcq?
      cloned_question_option = self.cloned_question_options.where("is_correct = ?",true).first
      answer = cloned_question_option.answer
    end
    if self.is_open_ended?
      cloned_question_option = self.cloned_question_options.first
      answer = cloned_question_option.answer if cloned_question_option.answer.present?
      answer = "Nothing added" if cloned_question_option.answer.blank?
    end
    if self.is_fill_in_the_blank?
      cloned_question_option = self.cloned_question_options.first
      answer = cloned_question_option.answer
    end
    answer
  end

  def self.create_the_clone(cloned_quiz_bank,question_id, question_score)
    question = Question.find(question_id)
    puts "question : "*10,question
    cloned_question = ClonedQuestion.create(seq: question.seq, description: question.description, question_type: question.question_type,difficulty_level: question.difficulty_level,
                  cloned_quiz_bank_id: cloned_quiz_bank.id, default_score: question_score)
    ClonedQuestionOption.create_the_clone(question,cloned_question)
    cloned_question
  end

  def self.create_random(cloned_quiz_bank,quiz_bank,number_of_questions)
    questions = quiz_bank.questions.sample(number_of_questions)
    questions.each do |question|
      cloned_question = ClonedQuestion.create(seq: question.seq, 
                          description: question.description, question_type: question.question_type,
                          difficulty_level: question.difficulty_level,
                          cloned_quiz_bank_id: cloned_quiz_bank.id, default_score: 10)
      ClonedQuestionOption.create_the_clone(question,cloned_question)
    end  
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :created_at => created_at,
      :updated_at => updated_at,
      :seq => seq,
      :description => description,
      :question_type => question_type,
      :difficulty_level => difficulty_level,
      :reference_url => reference_url,
      :cloned_section_id => cloned_section_id,
      :cloned_quiz_bank_id => cloned_quiz_bank_id,
      :cloned_question_options => cloned_question_options.as_json(),
      :score => default_score
    }
    
  end

end
