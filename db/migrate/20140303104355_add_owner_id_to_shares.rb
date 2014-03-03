class AddOwnerIdToShares < ActiveRecord::Migration
  def change
    add_column :shares, :owner_id, :integer
  end
end
