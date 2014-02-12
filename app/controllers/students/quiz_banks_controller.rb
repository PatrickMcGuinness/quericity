class Students::QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  #skip_before_filter :check_student_and_redirect
  
  def dashboard
  end


  def index
  end
end
