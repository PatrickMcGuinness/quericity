class AddDefaultGroupToEachUser < ActiveRecord::Migration
  def change
    User.find_each(:conditions => "role = 'Professor'") do |user|
      user.groups.create(:title => "default")
    end
  end
end
