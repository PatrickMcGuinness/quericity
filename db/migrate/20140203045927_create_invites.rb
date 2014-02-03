class CreateInvites < ActiveRecord::Migration
  def change
    create_table :invites do |t|
      t.integer :sender_id
      t.string :receiver_email
      t.integer :invitable_id
      t.string :invitable_type
      t.timestamps
    end
  end
end
