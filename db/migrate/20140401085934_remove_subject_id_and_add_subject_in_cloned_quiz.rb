class RemoveSubjectIdAndAddSubjectInClonedQuiz < ActiveRecord::Migration
  def up
  	change_column :cloned_quiz_banks, :subject_id, :string
    rename_column :cloned_quiz_banks, :subject_id, :subject
  end

  def down
  end
end
