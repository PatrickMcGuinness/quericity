class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :set_variables, :except => [:index,:all,:new,:create]
  
  
  def show
    @quiz_banks = @repository.quiz_banks.search(params[:q]).result(:distinct => true).page(params[:page])
    @repositories = current_user.repositories
  end
  
  def new
    @repository = Repository.new
    render layout: nil
  end
  
  def create
    @repository = Repository.create(params[:repository])
    @user_respository = current_user.user_repositories.create(:repository_id => @repository.id, :permission => "Owner")
    #@quiz_bank = @repository.quiz_banks.new(:title => "My Quiz Bank")
    render json:{title: @repository.title, id:@repository.id}
  end
  
  def edit
    render layout: nil
  end

  def update
    @repository.update_attributes(params[:repository])
    @repositories = current_user.repositories
    render layout:nil
  end
  
  def destroy
    @repository.update_attribute(:deleted_at, Time.now)
    render layout:nil
  end

  private

  def set_variables
    @repository = current_user.repositories.find(params[:id])
  end

end
