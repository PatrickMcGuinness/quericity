class Contact < ActiveRecord::Base
  attr_accessible :email
  validates :email,presence: true
  validates :email,uniqueness: true
  has_many :group_contacts
  has_many :groups, through: :group_contacts
  
  def self.create_contacts_from_emails(user,params)
    contacts = []
    group_ids = user.groups.pluck(:id)
    @group_contacts = GroupContact.where("group_id IN (?)", group_ids)
    emails = params[:emails].split(",")
    emails.each do |email|
      unless Contact.exists?(:email => email)
        contact = Contact.create(:email => email)
        GroupContact.create(:contact_id => contact.id)
        contacts << contact
      else
        unless @group_contacts.exists?(:contact_id => Contact.find_by_email(email).id)
          contacts << Contact.find_by_email(email)
        end
      end
    end
    contacts
  end

end
