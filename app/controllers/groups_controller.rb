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
    @group.delay.background_tasks_for_create(current_user,params)
    @groups = current_user.groups_to_show
    render layout:nil
  end

  def get_student
    @group = current_user.groups.find(params[:id])
  end

  def add_students
    @students, @invites = Group.add_students(current_user,params)
  end

  def add_students_edit
    @group = current_user.groups.find(params[:id])
    @student_groups, @invites = @group.add_students_edit(current_user,params)
  end

  def search_group
    @q = current_user.groups_to_show.search(params[:q])  
    @groups = @q.result(:distinct => true)
  end

  def destroy
    @group = current_user.groups.find(params[:id])
    @group.destroy
    @groups = current_user.groups_to_show
    render layout:nil
  end

  def update
    @group = current_user.groups.find(params[:id])
    @group.update_attributes(params[:group])
    @group.delay.background_tasks_for_update(current_user,params)
    @groups = current_user.groups_to_show
    render layout:nil
  end
end
