class ApplicationController < ActionController::Base
  
  protect_from_forgery
  before_filter :check_student_and_redirect
  #before_filter :intercept_html_requests
  after_filter :set_csrf_cookie_for_ng
  

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def check_student_and_redirect
    if user_signed_in?
      if current_user.is_student?
        unless self.class.parent.name == 'Students' or self.class.parent.name == 'Devise'
          redirect_to students_quiz_banks_path
        end  
      end
    end
  end

  

  protected
    def verified_request?
      super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
    end
    def intercept_html_requests
      render('home/index') if request.format == Mime::HTML and user_signed_in?
    end

end
