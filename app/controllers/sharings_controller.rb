class SharingsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @q = current_user.owned_sharings.search(params[:q])  
    @sharings = @q.result(:distinct => true)
    @quiz_banks = Sharing.get_unique_quiz_banks(@sharings)
    @groups = current_user.groups_to_show
  end
  
  def new
    @quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
  	@sharing = current_user.owned_sharings.new
  	render layout:nil
  end

  def create
  	#Sharing.create_sharings(current_user, params)
    Sharing.background_job_for_create(current_user,params)
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

  def add_students
    @users = Sharing.send_invitations(current_user,params)
  end

  def add_more_students
    @students, @invites = Sharing.add_more_students(current_user,params)
  end

end
