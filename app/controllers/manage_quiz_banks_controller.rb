class ManageQuizBanksController < ApplicationController

	before_filter :authenticate_user!

  def index
    @repositories = current_user.repositories
    @quiz_banks = current_user.quiz_banks
  end

  def starred_assessments
  	@quiz_banks = current_user.favourite_quizzes
  end

  def shared_assessments
  	@quiz_banks = current_user.shared_quiz_banks
  end
  
end
