class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  
  def index
    @repositories  = current_user.repositories
  end
  
  def new
    @repository = Repository.new
  end
  
  def create
    @repository = current_user.repositories.new(params[:repository])
    if @repository.save!
      redirect_to repositories_path
    else
      redirect_to new_repositories_path
    end
  end
  
  def edit
    @repository = current_user.repositories.find(params[:id])
  end
  
  def update
    @repository = current_user.repositories.find(params[:id])
    if @repository.update_attributes(params[:repository])
      redirect_to repositories_path
    else
      redirect_to edit_repositories_path
    end
  end
  
  def destroy
    @repository = current_user.repositories.find(params[:id])
    @repository.destroy
    redirect_to repositories_path
  end
end
