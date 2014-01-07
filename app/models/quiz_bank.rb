class QuizBank < ActiveRecord::Base
  attr_accessible :description, :title
  
  belongs_to :repository
  has_many :sections
  
  def self.search(search)
	  if search
	    find(:all, :conditions => ['title ILIKE ?', "%#{search}%"])
	  else
	    find(:all)
	  end
  end

end
