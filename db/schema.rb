# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140617111050) do

  create_table "answers", :force => true do |t|
    t.integer  "student_id"
    t.integer  "cloned_question_id"
    t.text     "student_answer"
    t.text     "answer"
    t.boolean  "is_correct"
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
    t.integer  "served_quiz_id"
    t.integer  "graded_by_teacher",  :default => 0
    t.integer  "student_score"
  end

  add_index "answers", ["cloned_question_id"], :name => "index_answers_on_cloned_question_id"
  add_index "answers", ["id"], :name => "index_answers_on_id"
  add_index "answers", ["served_quiz_id"], :name => "index_answers_on_served_quiz_id"
  add_index "answers", ["student_id"], :name => "index_answers_on_student_id"

  create_table "ckeditor_assets", :force => true do |t|
    t.string   "data_file_name",                  :null => false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "assetable_id"
    t.string   "assetable_type",    :limit => 30
    t.string   "type",              :limit => 30
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
  end

  add_index "ckeditor_assets", ["assetable_type", "assetable_id"], :name => "idx_ckeditor_assetable"
  add_index "ckeditor_assets", ["assetable_type", "type", "assetable_id"], :name => "idx_ckeditor_assetable_type"

  create_table "cloned_question_options", :force => true do |t|
    t.text     "answer"
    t.integer  "cloned_question_id"
    t.boolean  "is_correct"
    t.integer  "seq"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  add_index "cloned_question_options", ["cloned_question_id"], :name => "index_cloned_question_options_on_cloned_question_id"
  add_index "cloned_question_options", ["id"], :name => "index_cloned_question_options_on_id"

  create_table "cloned_questions", :force => true do |t|
    t.integer  "seq"
    t.text     "description"
    t.integer  "question_type"
    t.integer  "difficulty_level"
    t.string   "reference_url"
    t.integer  "cloned_section_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.integer  "cloned_quiz_bank_id"
    t.integer  "score"
  end

  add_index "cloned_questions", ["cloned_quiz_bank_id"], :name => "index_cloned_questions_on_cloned_quiz_bank_id"
  add_index "cloned_questions", ["id"], :name => "index_cloned_questions_on_id"
  add_index "cloned_questions", ["question_type"], :name => "index_cloned_questions_on_question_type"

  create_table "cloned_quiz_banks", :force => true do |t|
    t.integer  "description"
    t.string   "title"
    t.integer  "repository_id"
    t.string   "subject"
    t.text     "instructions"
    t.integer  "quiz_bank_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "cloned_sections", :force => true do |t|
    t.string   "title"
    t.integer  "seq"
    t.integer  "cloned_quiz_bank_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0, :null => false
    t.integer  "attempts",   :default => 0, :null => false
    t.text     "handler",                   :null => false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "favourite_quiz_banks", :force => true do |t|
    t.integer  "user_id"
    t.integer  "quiz_bank_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "favourite_quiz_banks", ["id"], :name => "index_favourite_quiz_banks_on_id"
  add_index "favourite_quiz_banks", ["quiz_bank_id"], :name => "index_favourite_quiz_banks_on_quiz_bank_id"
  add_index "favourite_quiz_banks", ["user_id"], :name => "index_favourite_quiz_banks_on_user_id"

  create_table "groups", :force => true do |t|
    t.string   "title"
    t.integer  "owner_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "groups", ["id"], :name => "index_groups_on_id"
  add_index "groups", ["owner_id"], :name => "index_groups_on_owner_id"

  create_table "invites", :force => true do |t|
    t.integer  "sender_id"
    t.string   "receiver_email"
    t.integer  "invitable_id"
    t.string   "invitable_type"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "question_options", :force => true do |t|
    t.integer  "question_id"
    t.integer  "seq",           :default => 0
    t.boolean  "is_correct"
    t.text     "answer"
    t.string   "option_detail"
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  add_index "question_options", ["id"], :name => "index_question_options_on_id"
  add_index "question_options", ["question_id"], :name => "index_question_options_on_question_id"

  create_table "question_topics", :force => true do |t|
    t.integer  "quiz_bank_id"
    t.integer  "topic_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "question_topics", ["id"], :name => "index_question_topics_on_id"
  add_index "question_topics", ["quiz_bank_id"], :name => "index_question_topics_on_quiz_bank_id"
  add_index "question_topics", ["topic_id"], :name => "index_question_topics_on_topic_id"

  create_table "questions", :force => true do |t|
    t.integer  "seq",              :default => 0
    t.text     "description"
    t.integer  "question_type"
    t.integer  "difficulty_level"
    t.text     "reference_url"
    t.integer  "section_id"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
    t.datetime "deleted_at"
  end

  add_index "questions", ["id"], :name => "index_questions_on_id"
  add_index "questions", ["section_id"], :name => "index_questions_on_section_id"

  create_table "quiz_banks", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.integer  "repository_id"
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
    t.string   "subject"
    t.datetime "deleted_at"
    t.text     "instructions"
    t.string   "slug"
    t.integer  "public"
    t.integer  "status",        :default => 0
  end

  add_index "quiz_banks", ["id"], :name => "index_quiz_banks_on_id"
  add_index "quiz_banks", ["repository_id"], :name => "index_quiz_banks_on_repository_id"
  add_index "quiz_banks", ["slug"], :name => "index_quiz_banks_on_slug", :unique => true
  add_index "quiz_banks", ["status"], :name => "index_quiz_banks_on_status"

  create_table "repositories", :force => true do |t|
    t.string   "title"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
    t.integer  "quiz_banks_count", :default => 0
    t.datetime "deleted_at"
    t.string   "slug"
    t.integer  "user_id"
  end

  add_index "repositories", ["id"], :name => "index_repositories_on_id"
  add_index "repositories", ["slug"], :name => "index_repositories_on_slug", :unique => true
  add_index "repositories", ["user_id"], :name => "index_repositories_on_user_id"

  create_table "sections", :force => true do |t|
    t.integer  "seq",             :default => 0
    t.integer  "quiz_bank_id"
    t.string   "title"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.datetime "deleted_at"
    t.integer  "questions_count", :default => 0
  end

  add_index "sections", ["id"], :name => "index_sections_on_id"
  add_index "sections", ["quiz_bank_id"], :name => "index_sections_on_quiz_bank_id"

  create_table "served_quizzes", :force => true do |t|
    t.integer  "owner_id"
    t.integer  "quiz_bank_id"
    t.datetime "created_at",                            :null => false
    t.datetime "updated_at",                            :null => false
    t.datetime "date"
    t.datetime "close_date"
    t.integer  "duration"
    t.integer  "answer"
    t.integer  "random"
    t.text     "instructions"
    t.datetime "start_time"
    t.integer  "infinite_duration"
    t.integer  "cloned_quiz_bank_id"
    t.datetime "end_time"
    t.integer  "number_of_questions"
    t.integer  "same_questions"
    t.integer  "show_in_sequence"
    t.integer  "show_all_questions",  :default => 0
    t.integer  "questions_per_page"
    t.integer  "no_expiration",       :default => 0
    t.integer  "status",              :default => 0
    t.boolean  "basic_scoring",       :default => true
  end

  add_index "served_quizzes", ["id"], :name => "index_served_quizzes_on_id"
  add_index "served_quizzes", ["owner_id"], :name => "index_served_quizzes_on_owner_id"
  add_index "served_quizzes", ["quiz_bank_id"], :name => "index_served_quizzes_on_quiz_bank_id"

  create_table "shares", :force => true do |t|
    t.integer  "shareable_id"
    t.string   "shareable_type"
    t.integer  "teacher_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
    t.integer  "owner_id"
    t.integer  "permissions"
  end

  create_table "sharings", :force => true do |t|
    t.integer  "user_id"
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.integer  "served_quiz_id"
    t.integer  "status",         :default => 1
  end

  add_index "sharings", ["id"], :name => "index_sharings_on_id"
  add_index "sharings", ["served_quiz_id"], :name => "index_sharings_on_served_quiz_id"
  add_index "sharings", ["status"], :name => "index_sharings_on_status"
  add_index "sharings", ["user_id"], :name => "index_sharings_on_user_id"

  create_table "student_groups", :force => true do |t|
    t.integer  "student_id"
    t.integer  "group_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "student_groups", ["group_id"], :name => "index_student_groups_on_group_id"
  add_index "student_groups", ["id"], :name => "index_student_groups_on_id"
  add_index "student_groups", ["student_id"], :name => "index_student_groups_on_student_id"

  create_table "subjects", :force => true do |t|
    t.string   "title"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "topics", :force => true do |t|
    t.string   "title"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at",                               :null => false
    t.datetime "updated_at",                               :null => false
    t.string   "email",                  :default => "",   :null => false
    t.string   "encrypted_password",     :default => ""
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        :default => 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "authentication_token"
    t.string   "profile_pic"
    t.string   "role"
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
    t.string   "provider"
    t.string   "uid"
    t.integer  "invitations_count"
    t.string   "time_zone"
    t.boolean  "show_tour",              :default => true
    t.boolean  "show_tooltip",           :default => true
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token", :unique => true
  add_index "users", ["invited_by_id"], :name => "index_users_on_invited_by_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true

end
