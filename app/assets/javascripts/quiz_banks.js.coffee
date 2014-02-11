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
  

  $(".quiz-bank-title-show").on "click",(e)->
    $(this).hide()
    $(".quiz-bank-title-edit").show()
    
  $(".section-title-show").on "click",(e)->
    id = $(this).attr("id")
    $(this).hide()
    $("#"+id+".section-title-edit").show()

  $(".tab-content").on "focusout", "#title-field", (e)->
    $(".quiz-bank-title-edit").hide()
    $(".quiz-bank-title-show").show()


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

  $(".glyphicon-comment").hover(
    ()->
      $("#description-popover").popover('show')
    ()->
      $("#description-popover").popover('hide')
    )        


