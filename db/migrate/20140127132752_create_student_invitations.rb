class CreateStudentInvitations < ActiveRecord::Migration
  def change
    create_table :student_invitations do |t|
      t.integer :quiz_bank_id
      t.string :email
      t.integer :sharing_id
      t.timestamps
    end
  end
end
