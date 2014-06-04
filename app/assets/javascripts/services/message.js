quizlib.service('Message', function ($rootScope){
  var type = null;
  var msg = null;
  var controller = null
  var message = undefined
  var message_array = [];
  
  return {
    push_message : function(message){
      message_array.push(message)
    },
    remove_message : function(message){
      index = message_array.indexOf(message)
      message_array.splice(index,1)
    },
    remove_message_by_controller : function(controller){
      angular.forEach(message_array,function(value,index){
        if(value.controller == controller){
          message_array.splice(index,1)
          message = undefined
        }
      })
    },
    get_message : function(controller){
      angular.forEach(message_array,function(value,index){
        if(value.controller == controller){
          message = value
          window.setTimeout(function(){
            message = undefined
            index = message_array.indexOf(message)
            message_array.splice(index,1)
            $(".alert").remove(); 
          }, 5000);
        }
      })
      return message
    }
  };
})