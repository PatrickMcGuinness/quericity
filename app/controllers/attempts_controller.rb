class AttemptsController < ApplicationController

  before_filter :authenticate_user!

  before_filter :set_variables

  respond_to :json


  def create
    render json: @sharing.attempts.create(params[:attempt])
  end

  def show
    render json: @sharing.attempts.find(params[:id])
  end

  private

  def set_variables
  	@served_quiz = ServedQuiz.find(params[:served_quiz_id])
    @sharing = ServedQuiz.find(params[:sharing_id])
  end

end
