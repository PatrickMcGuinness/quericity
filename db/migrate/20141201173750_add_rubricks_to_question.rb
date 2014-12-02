class AddRubricksToQuestion < ActiveRecord::Migration
  def change
	add_column :questions ,:rubrick ,:string
  end
end
