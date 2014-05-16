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
      data_array = data_time.split(":")
      if(data_array[0] < 10){
        data_array[0] = "0" + data_array[0]
      }
      if(data_array[1] < 10){
        data_array[1] = "0" + data_array[1]
      }
      return data_array.join(":")
    }

    
  };
})