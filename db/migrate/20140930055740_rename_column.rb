class RenameColumn < ActiveRecord::Migration
  def change
	rename_column :groups ,:protected ,:is_protected
  end
end
