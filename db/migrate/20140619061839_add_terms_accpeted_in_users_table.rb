class AddTermsAccpetedInUsersTable < ActiveRecord::Migration
  def change
    add_column :users, :terms_accepted, :boolean
  end
end
