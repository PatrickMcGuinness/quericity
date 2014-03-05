class AddGradedByTeacherToAnswers < ActiveRecord::Migration
  def change
    add_column :answers, :graded_by_teacher, :integer, :default => 0
  end
end
