class AddInfiniteDurationToServedQuizzes < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :infinite_duration, :integer 
  end
end
