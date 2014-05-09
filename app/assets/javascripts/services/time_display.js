quizlib.service('TimeDisplay', function ($rootScope){
  var date = null ;
  var time = null;
  return {
    get_date: function(data_date){
      var obj1 = new Date(data_date)
      date = obj1.getDate() +"-" + (obj1.getMonth()+1) +"-"+obj1.getFullYear()
      return date
    },
    get_time: function(data_time){
      var obj3 = new Date(data_time)
      time = obj3.getHours() + ":"
      if(obj3.getMinutes() < 10){
        time = time + "0" + obj3.getMinutes() 
      }
      else{ 
        time = time +  obj3.getMinutes()
      }
      return time
    }

    
  };
})