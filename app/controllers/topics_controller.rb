class TopicsController < ApplicationController
  
  before_filter :authenticate_user!
  respond_to :json
  
  def index
  	render json: Topic.all
  end

  def show
  	render json: Topic.find(params[:id])
  end

end
