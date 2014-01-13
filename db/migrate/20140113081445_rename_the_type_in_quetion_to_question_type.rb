class RenameTheTypeInQuetionToQuestionType < ActiveRecord::Migration
  def change
    rename_column :questions, :type, :question_type 
  end
end
