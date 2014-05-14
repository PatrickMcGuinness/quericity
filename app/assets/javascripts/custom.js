$(document).ready(function(){

  $("#sign-up").validate({
    rules: {
        'user[role]': {
          required: true,
          },
        'user[first_name]': {
          required: true,
          },
        'user[last_name]': {
          required: true
          },
        'user[email]': {
          required: true,
          remote: "/home/verify_email"
        },
        'user[password]': {
          required: true
        }           
    },
    messages: {
        'user[role]': {
          required: "Please select role",  
        },
        'user[first_name]': {
          required: "Please enter First Name"  
        },
        'user[last_name]': {
          required: "Please enter Last Name"
        },
        'user[email]': {
          required: "Please enter Email",
          remote: "Email Already Exists"
        },
        'user[password]':{
          required: "Please enter Password"
        }
    },
    highlight: function(element) {
        $(element).addClass("input-error").removeClass("input-success")
        $(element).siblings('label').remove();
        $(element).closest('.control_validate').removeClass('success').addClass('error');
    },
    // The success function receives label as element
    success: function(element) {
        // $("#" + $(element).attr('for')).css('border', 'black');
        $(element).siblings().addClass("input-success").removeClass("input-error")
        $(element).remove();
        $(element).closest('.control_validate').removeClass('error').addClass('success');
    }
  });

  $("#sign-in").validate({
    rules: {
        'user[email]': {
          required: true
        },
        'user[password]': {
          required: true
        }           
    },
    messages: {
        'user[email]': {
          required: "Please enter Email"
        },
        'user[password]':{
          required: "Please enter Password"
        }
    },
    highlight: function(element) {
        $(element).addClass("input-error").removeClass("input-success")
        $(element).siblings('label').remove();
        $(element).closest('.control_validate').removeClass('success').addClass('error');
    },
    // The success function receives label as element
    success: function(element) {
        // $("#" + $(element).attr('for')).css('border', 'black');
        $(element).siblings().addClass("input-success").removeClass("input-error")
        $(element).remove();
        $(element).closest('.control_validate').removeClass('error').addClass('success');
    }
  });


}); 