class CollaboratorsController < ApplicationController
  def index
    @repository = Repository.find(params[:repository_id])
    
  end

  def new
  end

  def edit
  end

  def destroy
  end
end
