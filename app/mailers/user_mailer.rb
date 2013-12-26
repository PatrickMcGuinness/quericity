class UserMailer < ActionMailer::Base
  default from: 'notification@quizlib.com'
 
  def welcome_email(collaborator)
    @user = collaborator
    mail(to: @user.email, subject: 'Added as collaborator')
  end

end
