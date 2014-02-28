class AddArchiveRepoToTeachers < ActiveRecord::Migration
  def change
    User.where("role = ?","Professor").each do |u|
      repo = Repository.create(:title => "Archive")
      u.user_repositories.create(:repository_id => repo.id, :permission => "Owner")
    end
  end
end
