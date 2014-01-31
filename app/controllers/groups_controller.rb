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
    @group.add_group_contacts(params)
    @groups = current_user.groups
    render layout:nil
  end

  def get_student
    @group = current_user.groups.find(params[:id])
  end

  def add_new_users
    Group.add_users(current_user,params)
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
    @group = current_user.groups.find(params[:id])
    @group.update_attributes(params[:group])
    @group.group_contacts.destroy_all if params[:contact_ids]
    @group.add_group_contacts(params) if params[:contact_ids]
    @groups = current_user.groups
    render layout:nil
  end
end
