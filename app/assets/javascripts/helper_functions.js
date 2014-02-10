function validateEmail(email){ 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validateCommaSeparatedEmails(emails){
  check = 0
  if(emails != ""){
    emails_array = emails.split(",")
    $.each(emails_array,function(index,value){
      if(!validateEmail(value)){
        check = 1
      }
    })
  }
  else{
    check = 1
  }
  if(check == 1){
    return false
  }
  else{
    return true
  }
}
