class CreateStudentGroups < ActiveRecord::Migration
  def change
    create_table :student_groups do |t|
      t.integer :student_id
      t.integer :group_id
      t.timestamps
    end
  end
end
