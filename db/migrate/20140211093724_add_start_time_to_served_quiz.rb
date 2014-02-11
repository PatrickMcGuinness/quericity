class AddStartTimeToServedQuiz < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :start_time, :datetime
  end
end
