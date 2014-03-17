class SubjectsController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def index
    render json: Subject.all
  end
end
