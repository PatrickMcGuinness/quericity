class GroupsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables, :except => [:create,:add_students,:search_group]

  def create
    @group = current_user.groups.create(params[:group])
    @group.delay.background_tasks_for_create(current_user,params)
    @groups = current_user.groups_to_show
    render layout:nil
  end

  def add_students
    @students, @invites = Group.add_students(current_user,params)
  end

  def add_students_edit
    @student_groups, @invites = @group.add_students_edit(current_user,params)
  end

  def search_group
    @q = current_user.groups_to_show.search(params[:q])  
    @groups = @q.result(:distinct => true)
  end

  def destroy
    @group.destroy
    @groups = current_user.groups_to_show
    render layout:nil
  end

  def update
    @group.update_attributes(params[:group])
    @group.delay.background_tasks_for_update(current_user,params)
    @groups = current_user.groups_to_show
    render layout:nil
  end

  def edit_title
    @group.update_attribute(:title, params[:title])
    @groups = current_user.groups_to_show
  end

  def get_all_students
    @student_groups = @group.student_groups
  end


  private

  def set_variables
    @group = params[:id].present? ? current_user.groups.find(params[:id]) : current_user.groups.new
  end 
end
