class ServedQuizzesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :clone_quiz_bank, only: [:create]
  before_filter :set_served_quiz, only: [:show_all_sharings,:get_status,:invited_students,:pending_students,:completed_students]
  def index
    @served_quizzes = current_user.served_quizzes
    @groups = current_user.groups_to_show
  end
  
  def new
    @quiz_bank = params[:quiz_bank_id].present? ? current_user.quiz_banks.find(params[:quiz_bank_id]) : nil
  	@served_quiz = current_user.served_quizzes.new
    @served_quiz.quiz_bank_id = @quiz_bank.id unless @quiz_bank.blank?
  end

  def create
    @served_quiz = current_user.served_quizzes.create(params[:served_quiz])
    @served_quiz.update_attribute(:cloned_quiz_bank_id,@cloned_quiz_bank.id)
    @served_quiz.background_job_for_create(current_user,params[:student_ids],params[:invite_ids])
    @served_quizzes = current_user.served_quizzes
    redirect_to served_quizzes_path
  end

  def history_search
    @served_quizzes = current_user.search_served_quizzes(params)
  end

  def get_instructions
    @quiz_bank = current_user.quiz_banks.find(params[:id])
    @instructions = @quiz_bank.instructions
    render json: {instructions: @instructions}
  end

  def get_all_questions
    @quiz_bank = current_user.quiz_banks.find(params[:id])
    @questions = @quiz_bank.questions
  end

  def add_more_students
    @students, @invites = Sharing.add_more_students(current_user,get_emails_list(params),params[:quiz_bank_id])
  end

  def get_all_students
    @sutdents = current_user.students
  end


  def show_all_sharings
    @sharings = @served_quiz.sharings
  end

  def get_status
    render layout:nil
  end

  def invited_students
    @sharings = @served_quiz.sharings.pending
    render layout:nil
  end

  def completed_students
    @sharings = @served_quiz.sharings.attempted
    render layout:nil
  end

  def pending_students
    @sharings = @served_quiz.sharings.started
  end

  private

  def get_emails_list(params)
    params[:emails].present? ? params[:emails].split(",") : []
  end

  def set_served_quiz
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end

  def clone_quiz_bank
    @cloned_quiz_bank = ServedQuiz.create_the_clone(params)
  end
end
