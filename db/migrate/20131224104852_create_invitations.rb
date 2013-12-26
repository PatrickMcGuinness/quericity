class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.string :email
      t.string :permission
      t.references :repository
      t.timestamps
    end
  end
end
