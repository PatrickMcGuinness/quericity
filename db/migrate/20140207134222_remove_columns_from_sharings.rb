class RemoveColumnsFromSharings < ActiveRecord::Migration
  def up
  	remove_column :sharings, :answer
    remove_column :sharings, :duration
    remove_column :sharings, :instructions
    remove_column :sharings, :close_date
    remove_column :sharings, :random
  end
end
