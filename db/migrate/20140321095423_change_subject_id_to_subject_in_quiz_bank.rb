class ChangeSubjectIdToSubjectInQuizBank < ActiveRecord::Migration
  def up
    change_column :quiz_banks, :subject_id, :string
    rename_column :quiz_banks, :subject_id, :subject
  end

  def down
  end
end
