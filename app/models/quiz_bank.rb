class QuizBank < ActiveRecord::Base
  attr_accessible :description, :title
  validates :title, :presence => true, :length => { minimum: 5 }
  belongs_to :repository
  has_many :sections, dependent: :destroy

  paginates_per 5

  def self.search(search)
	  if search
	    find(:all, :conditions => ['title ILIKE ? or description Ilike ?', "%#{search}%","%#{search}%" ])
	  else
	    find(:all)
	  end
  end

end
