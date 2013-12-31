$(document).ready(function(){
  
$("#new_user").validate({
      onkeyup: false,
      onclick: false,
      onfocusout: false,
      rules: {
          'user[password]': {
            required: true,
            minlength: 8
          },
          'user[email]': {
              required: true,
              email: true
          },
          'user[role]': {
              required: true
          }
      },
      messages: {
          'user[password]': {
            required: "Please enter password",  
            minlength:  "Please enter min 8 character"
          },
          
          'user[email]': {
             required: "Please enter email",
             email: "Please enter valid email"
          },
          'user[role]': {
             required: "Please select a role"
          }
      },
      highlight: function(element) {
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('success').addClass('error');
      },
      success: function(element) {
          // $("#" + $(element).attr('for')).css('border', 'black');
          
          $(element).addClass('valid').removeClass('error');
          
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('error').addClass('success');
      }
    });
$("#edit_user").validate({
      onkeyup: false,
      onclick: false,
      onfocusout: false,
      rules: {
          'user[current_password]': {
            required: true,
            minlength: 8
          },
          'user[email]': {
              required: true,
              email: true
          }
      },
      messages: {
          'user[current_password]': {
            required: "Please enter password",  
            minlength:  "Please enter min 8 characters"
          },    
          'user[email]': {
             required: "Please enter email",
             email: "Please enter valid email"
          }
      },
      highlight: function(element) {
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('success').addClass('error');
      },
      success: function(element) {
          // $("#" + $(element).attr('for')).css('border', 'black');
          
          $(element).addClass('valid').removeClass('error');
          
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('error').addClass('success');
      }
    });

$("#repo_form").validate({
      onkeyup: false,
      onclick: false,
      onfocusout: false,
      rules: {
          'repository[title]': {
            required: true,
            minlength: 5,
            maxlength: 50
          },
          'repository[description]': {
              required: true
          }
      },
      messages: {
          'repository[title]': {
            required: "Please enter title",
            minlength: "Please enter minimum 5 characters",
            maxlength: "Please enter maximum 50 characters"
          },
          
          'repository[description]': {
             required: "Please enter description"
          }
      },
      highlight: function(element) {
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('success').addClass('error');
      },
      success: function(element) {
          // $("#" + $(element).attr('for')).css('border', 'black');
          
          $(element).addClass('valid').removeClass('error');
          
          $(element).siblings('label').remove();
          $(element).closest('.control_validate').removeClass('error').addClass('success');
      }
    });
function readURL2(input1) {
        if (input1.files && input1.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#logo2').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input1.files[0]);
        }
    }
    
    $("#holder2").change(function(){
        readURL2(this);
    });

$("#up_logo_file2").click(function () {
             $("#holder2").trigger('click');
        });
});
