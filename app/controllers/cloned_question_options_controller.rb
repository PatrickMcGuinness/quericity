class ClonedQuestionOptionsController < ApplicationController

	before_filter :authenticate_user!

  respond_to :json


  def create
    render json: ClonedQuestionOption.create(params[:cloned_question_option]) 
  end


end
