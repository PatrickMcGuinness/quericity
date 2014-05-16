class RemoveTheTimeZoneFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :time_zone
    add_column :users, :time_zone, :decimal, :precision => 10, :scale => 2
  end
end
