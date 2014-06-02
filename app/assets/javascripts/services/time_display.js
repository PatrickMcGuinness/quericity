quizlib.service('TimeDisplay', function ($rootScope){
  var date = null ;
  return {
    get_date: function(data_date){
      var obj1 = new Date(data_date)
      date = obj1.getDate() +"-" + (obj1.getMonth()+1) +"-"+obj1.getFullYear() + " at "
      if(obj1.getHours() < 10){
        date = date + "0" + obj1.getHours() + " : "
      }
      else{
        date = date + obj1.getHours() + " : "
      }
      if(obj1.getMinutes() < 10){
        date = date + "0" + obj1.getMinutes()
      }
      else{
        date = date + obj1.getMinutes()
      } 
      return date
    }
  };
})