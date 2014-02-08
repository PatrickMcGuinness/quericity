class MoveColumnsBetweenSharingsAndServedQuiz < ActiveRecord::Migration
  def change
    remove_column :sharings, :date
    remove_column :sharings, :close_date
    remove_column :sharings, :duration
    remove_column :sharings, :answer
    remove_column :sharings, :random

    add_column :served_quizzes, :date, :datetime
    add_column :sharings, :close_date, :datetime
    add_column :sharings, :duration, :integer
    add_column :sharings, :answer, :integer
    add_column :sharings, :random, :integer
  end
end
