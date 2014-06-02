class AddNoExpirationInServedQuizzes < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :no_expiration, :integer, :default => 0
  end
end
