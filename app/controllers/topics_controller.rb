class TopicsController < ApplicationController
  before_filter :authenticate_user!
  
  def search
    @topics = Topic.search(params[:search])
    render json:{topics:@topics}
  end
end
