class ChangeTheTypeOfTimeZone < ActiveRecord::Migration
  def change
    change_column :users, :time_zone, :string
  end
end
