class AddColumnExplnationToQuestion < ActiveRecord::Migration
  def change
	add_column :questions ,:explanation ,:string
  end
end
