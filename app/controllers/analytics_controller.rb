class AnalyticsController < ApplicationController

  before_filter :authenticate_user!

  def index
  end

  def show
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end
end
