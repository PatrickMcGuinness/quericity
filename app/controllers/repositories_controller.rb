class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :set_variables, :except => [:index,:shared,:new,:create]
  
  def index
    @repositories  = current_user.own_repositories.page(params[:page])
  end
  
  def shared
    @shared_repositories  = current_user.shared_repositories
  end
  
  def show
    @quiz_banks = @repository.quiz_banks.search(params[:q]).result(:distinct => true).page(params[:page])
  end
  
  def new
    @repository = Repository.new
    render layout: nil
  end
  
  def create
    @repository = Repository.create(params[:repository])
    @user_respository = current_user.user_repositories.create(:repository_id => @repository.id, :permission => "Owner")
    @quiz_bank = @repository.quiz_banks.new(:title => "My Quiz Bank")
    render layout:nil
  end
  
  def edit
    render layout: nil
  end
  
  def get_all_collaborators
    @collaborators = @repository.collaborators
    render layout:nil
  end
  def update
    @repository.update_attributes(params[:repository])
    render layout:nil
  end
  
  def destroy
    @repository.update_attribute(:deleted_at, Time.now)
    render layout:nil
  end

  def update_title
    @repository.update_attribute(:title,params[:title])
    render json:{title: @repository.title}
  end

  def update_description
    @repository.update_attribute(:description,params[:description])
    render json:{description: @repository.description}
  end


  private

  def set_variables
    @repository = current_user.repositories.find(params[:id])
  end

end
