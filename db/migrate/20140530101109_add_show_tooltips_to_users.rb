class AddShowTooltipsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :show_tooltip, :boolean, :default => true
  end
end
