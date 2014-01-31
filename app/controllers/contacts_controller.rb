class ContactsController < ApplicationController

  before_filter :authenticate_user!

  def create_new_contacts
    @created_contacts = Contact.create_contacts_from_emails(current_user,params)
  end

end
