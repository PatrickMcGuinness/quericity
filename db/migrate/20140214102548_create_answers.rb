class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers do |t|
      t.integer :student_id
      t.integer :cloned_question_id
      t.text :student_answer
      t.text :answer
      t.boolean :is_correct
      t.timestamps
    end
  end
end
