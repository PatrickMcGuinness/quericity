class CollaboratorsController < ApplicationController

  before_filter :verify_owner, :only => :create
  before_filter :authenticate_user!

  def index
    @repository = current_user.repositories.find(params[:repository_id])
    @user_repository = current_user.user_repositories.where(:repository_id => params[:repository_id]) 
  end

  
  def create
    @repository = current_user.repositories.find(params[:repository_id])
    user = User.find_by_email(params[:email])
    if user.present?
      @collaborator = @repository.add_collaborator(user , params[:user_repository][:permission]) 
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
  end


  def verify_owner
    @repository = Repository.find(params[:repository_id])
    user = User.where(:email => params[:email]).first
    status = @repository.is_owner? user
    if status == true
      flash[:error] = "You are owner"
      render action: "index"
    end 
  end

end
