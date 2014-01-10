# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


jQuery ->

  $(".search-quiz-bank-from-show").on "click", (e)->
    e.preventDefault()
    _this = this
    value = $('.search-text').val()
    repo_id = $(".repo-id").val()
    console.log(repo_id)
    $.ajax
      url: "/repositories/"+repo_id,
      data: {search:value}
      success: (data)->
        $('.search-text').val("")
        $('table').html($(data).find('table').html())
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
