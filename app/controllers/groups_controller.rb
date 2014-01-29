class GroupsController < ApplicationController

  before_filter :authenticate_user!

  def new
    @group = current_user.groups.new
  end

  def edit
    @group = current_user.groups.find(params[:id])
  end

  def create
    @group = current_user.groups.create(params[:group])
    @group.add_student_groups(params)
    @groups = current_user.groups
    render layout:nil
  end

  def get_student
    @group = current_user.groups.find(params[:id])
  end

  def search_group
    @q = current_user.groups.search(params[:q])  
    @groups = @q.result(:distinct => true)
  end

  def destroy
    @group = current_user.groups.find(params[:id])
    @group.destroy
    @groups = current_user.groups
    render layout:nil
  end

  def update

  end
end
