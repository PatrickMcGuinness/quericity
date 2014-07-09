quizlib.filter('unsafe', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
});

quizlib.filter('substring', function() {
  return function(str, start, end) {
    return str.substring(start, end) + "...";
  };
})