class TopicsController < ApplicationController
  
  before_filter :authenticate_user!
  respond_to :json
  
  def index
  	render json: Topic.all
  end

  def show
  	render json: Topic.find(params[:id])
  end

  def create
  	render json: Topic.create(params[:create])
  end

  def search
    render json: Topic.search(params[:query])
  end

end
