class AddStatusValueToAllTheExistingSharings < ActiveRecord::Migration
  def change
    Sharing.update_all(:status => Sharing::Status::PENDING)
  end
end
