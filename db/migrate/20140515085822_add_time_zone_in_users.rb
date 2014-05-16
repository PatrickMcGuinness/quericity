class AddTimeZoneInUsers < ActiveRecord::Migration
  def up
    add_column :users, :time_zone, :decimal
  end

  def down
  end
end
