class GradeQuizzesController < ApplicationController

  before_filter :authenticate_user!

  def index
    @served_quizzes = current_user.served_quizzes
  end

end
