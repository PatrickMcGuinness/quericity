class FavouriteQuizBanksController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json
  
  def create
    render json: current_user.favourite_quiz_banks.create(params[:favourite_quiz_bank])
  end

  def index
    render json: current_user.favourite_quiz_banks
  end

  def update
    render json: current_user.favourite_quiz_banks.find(params[:id]).update_attributes(params[:favourite_quiz_bank])
  end

  


end
