class AddIndexToAllTables < ActiveRecord::Migration
  def change
    add_index :answers, :id
    add_index :answers, :student_id
    add_index :answers, :cloned_question_id
    add_index :answers, :served_quiz_id

    add_index :cloned_question_options, :cloned_question_id
    add_index :cloned_question_options, :id

    add_index :cloned_questions,:question_type
    add_index :cloned_questions, :cloned_quiz_bank_id
    add_index :cloned_questions, :id

    add_index :favourite_quiz_banks, :user_id
    add_index :favourite_quiz_banks, :quiz_bank_id
    add_index :favourite_quiz_banks, :id

    add_index :groups, :owner_id
    add_index :groups, :id

    add_index :question_options, :question_id
    add_index :question_options, :id

    add_index :question_topics, :quiz_bank_id
    add_index :question_topics, :topic_id
    add_index :question_topics, :id

    add_index :questions, :section_id
    add_index :questions, :id

    add_index :quiz_banks, :repository_id
    add_index :quiz_banks, :status
    add_index :quiz_banks, :id

    add_index :repositories, :user_id
    add_index :repositories, :id

    add_index :sections, :quiz_bank_id
    add_index :sections, :id

    add_index :served_quizzes, :owner_id
    add_index :served_quizzes, :quiz_bank_id
    add_index :served_quizzes, :id

    add_index :sharings, :user_id
    add_index :sharings, :served_quiz_id
    add_index :sharings, :status
    add_index :sharings, :id

    add_index :student_groups, :student_id
    add_index :student_groups, :group_id
    add_index :student_groups, :id

      
  end
end
