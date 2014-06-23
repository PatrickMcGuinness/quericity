class AddScoreToAttempt < ActiveRecord::Migration
  def change
    add_column :attempts, :score, :integer, :default => 0
  end
end
