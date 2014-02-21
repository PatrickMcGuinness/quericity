# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


jQuery ->

  $(".search-quiz-bank").on "click", (e)->
    e.preventDefault()
    _this = this
    value = $('.search-text').val()
    $.ajax
      url: "quiz_banks",
      data: {q:{title_or_description_cont:value}},
      success: (data)->
        $('.search-text').val("")
        $('.quiz-banks-div').html($(data).find('.quiz-banks-div').html())

  # Jquery for Quiz Bank show page
  
    
  $(".section-title-show").on "click",(e)->
    id = $(this).attr("id")
    $(this).hide()
    $("#"+id+".section-title-edit").show()

  ###
  $(".tab-content").on "keydown","#title-field",(key)->
    _this = this
    quiz_bank_id = $(".quiz-bank-title-edit").data("id")
    if(key.keyCode == 13)
      key.preventDefault()
      $.ajax
        url: "/quiz_banks/"+quiz_bank_id+"/update_title",
        data: {title: $(_this).val()},
        success: (data)->
          $(".quiz-bank-title-edit").hide()
          $(".quiz-bank-title-show").find(".title").html(data.title)
          $(".quiz-bank-title-show").show()
  ###        

  $(".tab-content").on "click", ".edit-quiz-bank",(e)->
    e.preventDefault()
    $(".quiz-bank-title-show").addClass("hide")
    $(".show-instructions").addClass("hide")
    $(".description-show").addClass("hide")
    $(".tags-show").addClass("hide")
    $(".quiz-bank-title-edit").removeClass("hide")
    $(".edit-instructions").removeClass("hide")
    $(".description-edit").removeClass("hide")
    $(".tags-edit").removeClass("hide")
    $(this).html("Save").addClass("save-quiz-bank").removeClass("edit-quiz-bank")


  $(".tab-content").on "click", ".save-quiz-bank",(e)->
    e.preventDefault()
    _this = this
    quiz_bank_id = $(".quiz-bank-title-edit").data("id")
    $.ajax
      url: "/quiz_banks/"+quiz_bank_id+"/update_quiz_bank",
      data: {quiz_bank:{title: $("#title-field").val(), description: $(".description-text").val(),instructions: $(".inst-edit").val()},question_topics: $(".tags-text").val()},
      success: (data)->
        console.log(data)
        $(".quiz-bank-title-show").removeClass("hide").html(data.quiz_bank.title)
        $(".show-instructions").removeClass("hide").html(data.quiz_bank.instructions)
        $(".description-show").removeClass("hide").html(data.quiz_bank.description)
        $(".tags-show").removeClass("hide")
        $(".quiz-bank-title-edit").addClass("hide")
        $(".edit-instructions").addClass("hide")
        $(".description-edit").addClass("hide")
        $(".tags-edit").addClass("hide")
        $(_this).html("Edit").addClass("edit-quiz-bank").removeClass("save-quiz-bank")
        $(".tags-show").html("")
        $(data.question_topics).each (index, element) =>
          console.log element
          $(".tags-show").append("<span class= 'badge badge-warning' id= "+element.id+">"+element.title+"<a href='/question_topics/"+element.id+"' data-remote='true' data-method='delete' data-confirm='Are you sure?'' rel='tooltip' title='Remove Tag'>x</a></span>")
