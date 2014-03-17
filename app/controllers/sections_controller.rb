class SectionsController < ApplicationController

  before_filter :authenticate_user!
  
  respond_to :json

  def index
    render json: QuizBank.find(params[:quiz_bank_id]).sections
  end

  def show
    render json: QuizBank.find(params[:quiz_bank_id]).sections.find(params[:id])
  end

  def edit
    render json: QuizBank.find(params[:quiz_bank_id]).sections.find(params[:id])
  end

  def update
    render json: QuizBank.find(params[:quiz_bank_id]).sections.find(params[:id]).update_attribute(params[:section])
  end

  def destroy
    render json: QuizBank.find(params[:quiz_bank_id]).sections.find(params[:id]).destroy

  def create 
    render json: QuizBank.find(params[:quiz_bank_id]).sections.create(params[:section])
  end

  def default_section
    render json: QuizBank.find(params[:quiz_bank_id]).default_section
  end

end
