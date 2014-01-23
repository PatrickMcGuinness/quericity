class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  
  def index
    @repositories  = current_user.own_repositories
  end
  
  def shared
    @shared_repositories  = current_user.shared_repositories
  end
  
  def show
    @repository = current_user.repositories.find(params[:id])
    @quiz_banks = @repository.quiz_banks.search(params[:search],current_user)
    #@quiz_banks = Kaminari.paginate_array(myarray).page(params[:page]).per(5)
  end
  
  def new
    @repository = Repository.new
    render layout: nil
  end
  
  def create
    @repository = Repository.create(params[:repository])
    @user_respository = current_user.user_repositories.create(:repository_id => @repository.id, :permission => "Owner")
    @quiz_bank = @repository.quiz_banks.create(:title => "My QuizBank 1", :description => "This is the default quizbank")
    render layout:nil
  end
  
  def edit
    @repository = current_user.repositories.find(params[:id])
    render layout: nil
  end
  
  def update
    @repository = current_user.repositories.find(params[:id])
    @repository.update_attributes(params[:repository])
    render layout:nil
  end
  
  def destroy
    @repository = current_user.repositories.find(params[:id])
    @repository_id = @repository.id
    @repository.destroy
    render layout:nil
  end

  def update_title
    @repository = current_user.repositories.find(params[:id])
    @repository.title = params[:title]
    @repository.save
    render json:{title: @repository.title}
  end

end
