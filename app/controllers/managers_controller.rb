class ManagersController < ApplicationController

	before_filter :authenticate_user!

  def index
    @repositories = current_user.repositories
    @quiz_banks = current_user.quiz_banks
  end

end
