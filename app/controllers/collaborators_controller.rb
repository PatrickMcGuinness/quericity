class CollaboratorsController < ApplicationController
  def index
    @repository = Repository.find(params[:repository_id])
    @user_repository = UserRepository.where(:repository_id => params[:repository_id]) 
  end

  
  def create
    @repository = Repository.find(params[:repository_id])

    user = User.where(:email => params[:email]).first
    if user.present?
      @collaborator = @repository.add_collaborator user , params[:user_repository][:permission]
    else
      @invitation = @repository.invitations.create(:email => params[:email] ,:permission => params[:user_repository][:permission])
    end  

  end

  def edit
  end
  
  def update
  end

  def destroy
    @user_repository = UserRepository.where(:repository_id => params[:repository_id] , :user_id => params[:id]).first
    @user_repository.destroy 
    redirect_to :back
  end
end
