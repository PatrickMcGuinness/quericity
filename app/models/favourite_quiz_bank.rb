class FavouriteQuizBank < ActiveRecord::Base
  attr_accessible :user_id, :quiz_bank_id

  belongs_to :user
  belongs_to :quiz_bank


  def self.find_by_user_id_and_quiz_bank_id(user,quiz_bank)
  	favourite = nil
    favourites = FavouriteQuizBank.where("quiz_bank_id = ? and user_id = ?",quiz_bank.id, user.id)
  	if favourites.present?
  		favourite = favourites.first
    end
    favourite
  end

end
