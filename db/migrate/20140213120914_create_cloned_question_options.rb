class CreateClonedQuestionOptions < ActiveRecord::Migration
  def change
    create_table :cloned_question_options do |t|
      t.text  :answer
      t.integer :cloned_question_id
      t.boolean :is_correct
      t.integer :seq
      t.timestamps
    end
  end
end
