class AddPermissionToShare < ActiveRecord::Migration
  def change
    add_column :shares, :permissions, :integer
  end
end
