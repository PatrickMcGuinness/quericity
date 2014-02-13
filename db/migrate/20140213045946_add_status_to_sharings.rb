class AddStatusToSharings < ActiveRecord::Migration
  def change
    add_column :sharings, :status, :integer, :default => 1 
  end
end
