class QuestionTopicsController < ApplicationController

  before_filter :authenticate_user!

  def create
  end
  def destroy
    @question_topic = QuestionTopic.find(params[:id])
    @question_topic_id = @question_topic.id
    @question_topic.destroy
    render layout:nil
  end
end
