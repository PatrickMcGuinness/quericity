class AddColumnsToGrouos < ActiveRecord::Migration
  def change
  	add_column :groups ,:searcable ,:boolean
	add_column :groups ,:protected ,:boolean
	add_column :groups ,:code ,:string 
  end
end
