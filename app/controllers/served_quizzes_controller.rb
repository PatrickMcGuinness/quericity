class ServedQuizzesController < ApplicationController
  before_filter :authenticate_user!

  def index
    @served_quizzes = current_user.served_quizzes
    @groups = current_user.groups_to_show
  end
  
  def new
    @quiz_bank = params[:quiz_bank_id].present? ? current_user.quiz_banks.find(params[:quiz_bank_id]) : nil
  	@served_quiz = current_user.served_quizzes.new
    @served_quiz.quiz_bank_id = @quiz_bank.id unless @quiz_bank.blank?
  	render layout:nil
  end

  def create
    @served_quiz = current_user.served_quizzes.create(params[:served_quiz])
    @served_quiz.background_job_for_create(current_user,params[:student_ids],params[:invite_ids])
    @served_quizzes = current_user.served_quizzes
  	#render layout:nil
  end

  def history_search
    @served_quizzes = current_user.search_served_quizzes(params)
  end

  def add_more_students
    @students, @invites = Sharing.add_more_students(current_user,get_emails_list(params),params[:quiz_bank_id])
  end

  def get_all_students
    @sutdents = current_user.students
  end

  private

  def get_emails_list(params)
    params[:emails].present? ? params[:emails].split(",") : []
  end
end
