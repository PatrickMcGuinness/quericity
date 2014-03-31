class StudentGroupsController < ApplicationController
  before_filter :authenticate_user!

  respond_to :json

  def create
  	render json: StudentGroup.create(params[:student_group])
  end

  def show
  	render json: StudentGroup.find(params[:id])
  end

  def edit
  	render json: StudentGroup.find(params[:id])
  end

  def update
  	render json: StudentGroup.find(params[:id]).update_atttributes(params[:stduent_group])
  end

  def destroy
  	render json: StudentGroup.find(params[:id]).destroy
  end
end
