student_quizlib.service('QuizStatus', function ($rootScope){

  return {
    get_status: function(obj1,obj2,local_start_time,local_end_time) {
      
      var start_time_array = local_start_time.split(":")
      var end_time_array = local_end_time.split(":")
      
      var obj1 = obj1
      var obj2 = obj2
      
      status = "Not Served Yet"
      var obj = new Date()
      if(obj1.getFullYear() < obj.getFullYear() || obj1.getMonth() < obj.getMonth() || obj1.getDate() < obj.getMonth()){
        status = "In Process"
      }
      if(obj1.getFullYear() == obj.getFullYear() && obj1.getMonth() == obj.getMonth() && obj1.getDate() == obj.getDate()){
        if((start_time_array[0] < obj.getHours())){
          status = "In Process"
        }
        else if(start_time_array[0] == obj.getHours()){
          if(start_time_array[1] <= obj.getMinutes()){
            status = "In Process"
          }
        }
      }
      if(obj2.getFullYear() < obj.getFullYear() || obj2.getMonth() < obj.getMonth() || obj2.getDate() < obj.getMonth()){
        status = "Serving Completed"
      }
      if( obj2.getFullYear() == obj.getFullYear() && obj2.getMonth() == obj.getMonth() && obj2.getDate() == obj.getDate()){
        if((end_time_array[0] < obj.getHours())){
          status = "Serving Completed"
        }
        else if(end_time_array[0] == obj.getHours()){
          if(end_time_array[1] <= obj.getMinutes()){
            status = "Serving Completed"
          }
        }
      }
      return status
    }
   };
})