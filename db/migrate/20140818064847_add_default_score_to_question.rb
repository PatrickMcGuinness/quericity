class AddDefaultScoreToQuestion < ActiveRecord::Migration
  def change
	add_column :questions , :default_score ,:integer ,:default => 10
  end
end
