class SharingsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @q = current_user.owned_sharings.search(params[:q])  
    @sharings = @q.result(:distinct => true)
    @quiz_banks = Sharing.get_unique_quiz_banks(@sharings)
    @groups = current_user.groups_to_show
  end
  
  def new
    @quiz_bank = params[:quiz_bank_id].present? ? current_user.quiz_banks.find(params[:quiz_bank_id]) : nil
  	@sharing = current_user.owned_sharings.new
  	render layout:nil
  end

  def create
    Sharing.delay.background_job_for_create(current_user,params)
    @q = current_user.owned_sharings.search(params[:q])
    @sharings = @q.result(:distinct => true) 
    @quiz_banks = Sharing.get_unique_quiz_banks(@sharings)
  	render layout:nil
  end

  def history_search
    @sharings = current_user.owned_sharings
    @quiz_banks = Sharing.get_unique_quiz_banks(@sharings)
    @quiz_banks = @quiz_banks.search(params[:q]).result(:distinct => true)
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
