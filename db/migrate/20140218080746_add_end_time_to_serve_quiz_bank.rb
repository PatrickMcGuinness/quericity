class AddEndTimeToServeQuizBank < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :end_time, :datetime
  end
end
