class Students::QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  #skip_before_filter :check_student_and_redirect
  
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
end
