class StudentGroupsController < ApplicationController
  before_filter :authenticate_user!

  def destroy
    @student_group = StudentGroup.find(params[:id])
    @student_group_id = @student_group.id
    @student_group.destroy
  end
end
