class CollaboratorsController < ApplicationController
  def index
    @repository = Repository.find(params[:repository_id]) 
  end

  def new
    
  end
  
  def create
    user = User.where(:email => params[:email]).first
    @repository = Repository.find(params[:repository_id])
    @status = @repository.add_collaborator user , params[:permission]
  end

  def edit
  end
  
  def update
  end

  def destroy
    @repository = Repository.find(params[:repository_id])
    @repository.collaborators.where(:id => params[:id])
  end
end
