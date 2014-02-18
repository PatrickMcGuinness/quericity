class Students::QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_quiz_and_sharing, only: [:attempt_quiz,:take_quiz]
  layout "preview", only: [:take_quiz,:attempt_quiz]
  
  def dashboard
  end


  def index
  	@sharings = current_user.sharings
  end

  def attempted
  	@sharings = current_user.sharings.attempted
  end

  def pending
  	@sharings = current_user.sharings.pending
  end

  def expired
  	@sharings = current_user.sharings.expired
  end

  def attempt_quiz
    #@sharing.update_attribute(:status, Sharing::Status::ATTEMPTED)
    @question = @served_quiz.next_question(current_user)
    @question_number  = @served_quiz.question_number(current_user)
    if @served_quiz.should_redirect?(current_user)
      redirect_to answer_sheet_students_quiz_banks_path(served_quiz_id: @served_quiz.id)
    end
  end

  def check_answer
    @cloned_question = ClonedQuestion.find(params[:question_id])
    @served_quiz = ServedQuiz.find(params[:served_quiz_id])
    @answer = Answer.check_answer(current_user,@cloned_question,params[:answer],@served_quiz.id)
    @question = @served_quiz.next_question(current_user)
    @question_number = @served_quiz.question_number(current_user)
    if @served_quiz.should_redirect?(current_user)
      redirect_to answer_sheet_students_quiz_banks_path(served_quiz_id: @served_quiz.id)
    end
  end

  def answer_sheet
    @served_quiz = ServedQuiz.find(params[:served_quiz_id])
  end

  private
  
  def set_quiz_and_sharing
    @served_quiz = ServedQuiz.find(params[:id])
    @sharing = current_user.sharings.find(params[:sharing_id])
  end

end
