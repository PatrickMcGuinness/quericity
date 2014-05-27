class AddShowTourInUsers < ActiveRecord::Migration
  def change
    add_column :users, :show_tour, :boolean, :default => true
  end
end
