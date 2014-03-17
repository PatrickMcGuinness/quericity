class QuizBanksController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def index
    render json: current_user.quiz_banks
  end

  def show
    render json: current_user.quiz_banks.find(params[:id])
  end

  def edit
    render json: current_user.quiz_banks.find(params[:id])
  end

  def update
    render json: current_user.quiz_banks.find(params[:id]).update_attributes(param[:quiz_bank])
  end

  def destroy
    render json: current_user.quiz_banks.find(params[:id]).destroy
  end

  def create 
    render json: QuizBank.create(params[:quiz_bank])
  end

  def new
    @default_repo = current_user.default_repo
    render json: QuizBank.new(:title => "My Quiz Bank", :repo => @default_repo.id) 
  end
  
  

  

end
