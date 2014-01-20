$(document).ready(function(){
  
$("#password_change").validate({
  onkeyup: false,
  onclick: false,
  onfocusout: false,
  rules: {
      'new_password': {
          required: true,
          minlength: 9
      },
      'confirm_password': {
          required: true,
          minlength: 9,
          equalTo: "#new_password"
      }
  },
  messages: {
      'new_password': {
         required: "Please enter new password",
         minlength:  "Please enter min 9 character"
      },
      'confirm_password': {
         required: "Please enter password confirmation",
         minlength:  "Please enter min 9 character",
         equalTo: "Confirmation does not match new password"
      }
  },
  highlight: function(element) {
      $(element).siblings('label').remove();
      $(element).closest('.control_validate').removeClass('success').addClass('error');
  },
  // The success function receives label as element
  success: function(element) {
      // $("#" + $(element).attr('for')).css('border', 'black');
      $(element).remove();
      $(element).closest('.control_validate').removeClass('error').addClass('success');
  }
});
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
      // The success function receives label as element
      success: function(element) {
          // $("#" + $(element).attr('for')).css('border', 'black');
          $(element).remove();
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
      // Success function accepts label as an element
      success: function(element) {
          // $("#" + $(element).attr('for')).css('border', 'black');
          
          $(element).remove();
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
