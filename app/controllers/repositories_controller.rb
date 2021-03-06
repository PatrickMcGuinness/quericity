class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  respond_to :json

  def index
    render json: current_user.repositories.where("id != ?",current_user.default_repo.id)
  end

  def show
    render json: Repository.find(params[:id])
  end

  def edit
    render json: Repository.find(params[:id])
  end

  def update
    render json: current_user.repositories.find(params[:id]).update_attributes(params[:repository])
  end

  def destroy
    render json: current_user.repositories.find(params[:id]).destroy
  end

  def create 
    render json: current_user.repositories.create(params[:repository])
  end

  def default_repo
    render json: current_user.default_repo
  end

end
