quizlib.service('QuizStatus', function ($rootScope){

  return {
    get_status: function(obj1,obj2,status) {
      
      //var start_time_array = local_start_time.split(":")
      //var end_time_array = local_end_time.split(":")
      if(status == 1){
        return "Serving Completed"
      }
      else{
        var obj1 = obj1
        var obj2 = obj2
        
        status = "Not Served Yet"
        var obj = new Date()
        if(obj1.getFullYear() < obj.getFullYear() || obj1.getMonth() < obj.getMonth() || obj1.getDate() < obj.getDate()){
          status = "In Process"
        }
        if(obj1.getFullYear() == obj.getFullYear() && obj1.getMonth() == obj.getMonth() && obj1.getDate() == obj.getDate()){
          if((obj1.getHours() < obj.getHours())){
            status = "In Process"
          }
          else if(obj1.getHours() == obj.getHours()){
            if(obj1.getMinutes() <= obj.getMinutes()){
              status = "In Process"
            }
          }
        }
        if(obj2.getFullYear() <= obj.getFullYear()){
          if(obj2.getMonth() < obj.getMonth()){
            status = "Serving Completed"
          }
          else if(obj2.getMonth() == obj.getMonth()){
            if(obj2.getDate() < obj.getDate()){
              status = "Serving Completed"
            }
          }
        }
        if( obj2.getFullYear() == obj.getFullYear() && obj2.getMonth() == obj.getMonth() && obj2.getDate() == obj.getDate()){
          if((obj2.getHours() < obj.getHours())){
            status = "Serving Completed"
          }
          else if(obj2.getHours() == obj.getHours()){
            if(obj2.getMinutes() <= obj.getMinutes()){
              status = "Serving Completed"
            }
          }
        }
        return status
      }  
    }
   };
})