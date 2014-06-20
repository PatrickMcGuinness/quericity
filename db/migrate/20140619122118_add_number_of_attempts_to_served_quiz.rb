class AddNumberOfAttemptsToServedQuiz < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :number_of_attempts, :integer, :default => 1
  end
end
