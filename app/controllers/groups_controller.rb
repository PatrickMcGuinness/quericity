class GroupsController < ApplicationController

  before_filter :authenticate_user!
  respond_to :json

  def create

    puts "params"*100,params
    @group = Group.new(title: params[:title],code: params[:code],is_protected: params[:is_protected] ,owner_id: current_user.id,searcable: params[:searchable])
    @group.save!
    render json: @group
  end

  def index
    render json: current_user.groups
  end

  def show
    render json: current_user.groups.find(params[:id])
  end

  def edit
    render json: current_user.groups.find(params[:id])
  end

  def update
    render json: current_user.groups.find(params[:id]).update_attributes(params[:group])
  end

  def destroy
    render json: current_user.groups.find(params[:id]).destroy
  end

  def get_student_groups
    render json: current_user.groups.find(params[:id]).student_groups
  end

  def students
    render json: current_user.groups.find(params[:id]).students
  end

  def all_groups_of_student
    arr = Array.new
    current_user.student_groups.each do |g|
      arr.push(g.group)
    end
    render json: arr 
  end

   def all_groups
    arr = Array.new
    Group.where('searcable = true').each do |g|
      arr.push(g)
    end
    render json: arr 
  end


  def enrol_in_the_group
    sg = StudentGroup.new(student_id: current_user.id,group_id:params[:id])
    sg.save!
    render json: sg.group
  end



end
