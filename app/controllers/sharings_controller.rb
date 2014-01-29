class SharingsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @q = current_user.owned_sharings.search(params[:q])  
    @sharings = @q.result(:distinct => true)
    @quiz_banks = Sharing.get_unique_quiz_banks(@sharings)
    @groups = current_user.groups
  end
  
  def new
  	@sharing = current_user.owned_sharings.new
  	render layout:nil
  end

  def create
  	Sharing.create_sharings(current_user, params)
  	render layout:nil
  end

  def history_search
    @quiz_banks = current_user.quiz_banks.search(params[:q]).result(:distinct => true)
  end
end
