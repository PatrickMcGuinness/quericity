class RemoveSubjectIdFromQuestionAndAddSubjectIdToQuizBank < ActiveRecord::Migration
  def change
  	remove_column :questions, :subject_id
  	add_column :quiz_banks, :subject_id, :integer 
  end
end
