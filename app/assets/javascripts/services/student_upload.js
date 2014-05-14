student_quizlib.service('fileUpload', ['$http','$rootScope', function ($http,$rootScope) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('profile_pic', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(function(data){
      $rootScope.$broadcast('profile_pic_Changed', data.profile_pic);
    })
    .error(function(){
      console.log("error")
    });
  }
}]);