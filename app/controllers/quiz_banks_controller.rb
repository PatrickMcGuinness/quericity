class QuizBanksController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def index
    render json: current_user.quiz_banks.where("status = ?",QuizBank::Status::SAVED)
  end

  def show
    #render json: current_user.quiz_banks.find(params[:id])
    render json: QuizBank.find(params[:id])
  end

  def edit
    render json: QuizBank.find(params[:id])
  end

  def update
    render json: QuizBank.find(params[:id]).update_attributes(params[:quiz_bank])
  end

  def destroy
    render json: QuizBank.find(params[:id]).update_attribute("deleted_at", Time.now)
  end

  def create 
    render json: QuizBank.create(params[:quiz_bank])
  end

  def new
    @default_repo = current_user.default_repo
    render json: QuizBank.new(:title => "My Quiz Bank", :repo => @default_repo.id) 
  end

  def shared_quiz_banks
    render json: current_user.shared_quiz_banks
  end

  def repo_quiz_banks
    render json: current_user.repo_quiz_banks(params)
  end

  def clone
    @quiz_bank = QuizBank.find(params[:id])
    render json: @quiz_bank.clone_the_quiz(current_user)
  end

  def questions
    @quiz_bank = QuizBank.find(params[:id])
    render json: @quiz_bank.questions
  end

  def quiz_banks_list
    render json: QuizBank.quiz_banks_list(current_user)
    #render json: 
  end

  def share_with_list
    render json: QuizBank.find(params[:id]).share_with_list(params[:emails],current_user)
  end

  def delete_share
    render json: QuizBank.find(params[:id]).delete_share(params[:share_id])
  end

  def change_question_positions
    params[:"question"].each_with_index do |id, index|
      Question.update_all({seq: index+1},{id: id})
    end    
    render nothing: true
  end
  
  
end
