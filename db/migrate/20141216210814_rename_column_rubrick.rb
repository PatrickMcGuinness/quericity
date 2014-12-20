class RenameColumnRubrick < ActiveRecord::Migration
  def change
	rename_column :questions ,:rubrick ,:rubric
  end

end
