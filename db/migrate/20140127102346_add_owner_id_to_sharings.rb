class AddOwnerIdToSharings < ActiveRecord::Migration
  def change
    add_column :sharings, :owner_id,:integer 
  end
end
