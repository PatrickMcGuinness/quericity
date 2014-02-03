class InvitesController < ApplicationController
  before_filter :authenticate_user!

  def destroy
    @invite = current_user.invites.find(params[:id])
    @invite_id = @invite.id
    @invite.destroy
  end
end
