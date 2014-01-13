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

ActiveRecord::Schema.define(:version => 20140113081445) do

  create_table "invitations", :force => true do |t|
    t.string   "email"
    t.string   "permission"
    t.integer  "repository_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
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

  create_table "question_topics", :force => true do |t|
    t.integer  "quiz_bank_id"
    t.integer  "topic_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "questions", :force => true do |t|
    t.integer  "subject_id"
    t.integer  "seq",              :default => 0
    t.text     "description"
    t.integer  "question_type"
    t.integer  "difficulty_level"
    t.text     "reference_url"
    t.integer  "section_id"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
  end

  create_table "quiz_banks", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "repository_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "repositories", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "sections", :force => true do |t|
    t.integer  "seq",          :default => 0
    t.integer  "quiz_bank_id"
    t.string   "title"
    t.datetime "created_at",                  :null => false
    t.datetime "updated_at",                  :null => false
  end

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

  create_table "user_repositories", :force => true do |t|
    t.integer  "user_id"
    t.integer  "repository_id"
    t.string   "permission"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
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
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true

end
