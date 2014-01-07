class CreateQuestionOptions < ActiveRecord::Migration
  def change
    create_table :question_options do |t|
      t.integer :question_id
      t.integer :seq, :default => 0
      t.boolean :is_correct
      t.text :answer
      t.string :option_detail
      t.timestamps
    end
  end
end
