class ClonedQuestion < ActiveRecord::Base
  attr_accessible :title,:seq, :description, :question_type,:difficulty_level,
                  :reference_url,:cloned_section_id, :cloned_quiz_bank_id

  has_many :cloned_question_options
  has_many :answers

  belongs_to :cloned_quiz_bank
 

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

  def self.create_the_clone(cloned_quiz_bank,params)
    if params[:select_question].present?
      questions = Question.where("id IN (?)",params[:questions_ids])
    else
      number = params[:served_quiz][:number_of_questions].to_i
      if params[:served_quiz][:show_in_sequence] == ServedQuiz::Sequence::YES
        questions_array = cloned_quiz_bank.quiz_bank.questions.order("seq ASC")
      else
        questions_array = cloned_quiz_bank.quiz_bank.questions
      end
      questions = questions_array.sample(number)       
    end
    questions.each do |question|
      cloned_question = ClonedQuestion.create(:seq => question.seq, 
                          :description => question.description, :question_type => question.question_type,
                          :difficulty_level => question.difficulty_level,
                          :cloned_quiz_bank_id => cloned_quiz_bank.id)
      ClonedQuestionOption.create_the_clone(question,cloned_question)
    end  
  end
end
