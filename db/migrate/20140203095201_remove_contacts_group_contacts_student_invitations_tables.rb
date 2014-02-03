class RemoveContactsGroupContactsStudentInvitationsTables < ActiveRecord::Migration
  def change
    drop_table :contacts
    drop_table :group_contacts
    drop_table :student_invitations
  end
end
