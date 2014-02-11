class AddInvitationsCountToUsers < ActiveRecord::Migration
  def up
    add_column :users, :invitations_count, :integer
  end
  
  def down
    remove_column :users, :invitations_count
  end
end
