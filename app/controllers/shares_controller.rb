class SharesController < ApplicationController

	before_filter :authenticate_user!
  before_filter :get_shareable

	def index
    
	end

  private

  def get_shareable
    @shareable = current_user.quiz_banks.find(params[:id]) 
  end

end
