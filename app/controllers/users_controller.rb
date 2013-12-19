class UsersController < ApplicationController

	def profile
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
    end
  end
end
