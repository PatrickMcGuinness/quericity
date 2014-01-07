class RepositoriesController < ApplicationController
  
  before_filter :authenticate_user!
  
  def index
    @repositories  = current_user.repositories
  end
  
  def shared
    @shared_repositories  = current_user.shared_repositories
  end
  
  def show
    @repository = current_user.repositories.find(params[:id])
    if params[:search]
      myarray = @repository.quiz_banks.search(params[:search])
      @quiz_banks = Kaminari.paginate_array(myarray).page(params[:page]).per(5)
    else
      myarray = @repository.quiz_banks
      @quiz_banks = Kaminari.paginate_array(myarray).page(params[:page]).per(5)
    end
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
    @repository = Repository.find(params[:id])
  end
  
  def update
    @repository = Repository.find(params[:id])
    if @repository.update_attributes(params[:repository])
      redirect_to repositories_path, notice: 'Updated Successfully.'
    else
      redirect_to edit_repositories_path
    end
  end
  
  def destroy
    @repository = current_user.repositories.find(params[:id])
    @repository.destroy
    redirect_to repositories_path, notice: 'Deleted Successfully.'
  end

end
