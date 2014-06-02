class AddStatusToServedQuiz < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :status, :integer, :default => 0
  end
end
