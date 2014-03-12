class DropTableInvitations < ActiveRecord::Migration
  def up
    drop_table :invitations
  end
end
