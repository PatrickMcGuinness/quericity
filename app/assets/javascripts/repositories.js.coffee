# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


jQuery ->

  $(".search-quiz-bank-from-show").on "click", (e)->
    e.preventDefault()
    _this = this
    value = $('.search-text').val()
    repo_id = $(".repo-id").val()
    $.ajax
      url: "/repositories/"+repo_id,
      data: {q:{title_or_description_cont:value}}
      success: (data)->
        $('.search-text').val("")
        $('.quiz-banks-div').html($(data).find('.quiz-banks-div').html())

  $(".create-repo").on "click", (e)->
    $(this).append(get_ajax_loader_html())

  $(".edit-repo").on "click", (e)->
    $(this).append(get_ajax_loader_html())
    
  $(".share-repo").on "click", (e)->
    $(this).append(get_ajax_loader_html())
        
  $(".add-quiz").on "click", (e)->
    $(this).append(get_ajax_loader_html())

  $(".repo-title-show").on "click", (e)->
    $(this).addClass("hide")
    $(".repo-title-edit").removeClass("hide")

  $(".tab-content").on "keydown","#title-field",(key)->
      _this = this
      repo_id = $(".repo-title-edit").data("id")
      if(key.keyCode == 13)
        key.preventDefault()
        $.ajax
          url: "/repositories/"+repo_id+"/update_title",
          data: {title: $(_this).val()},
          success: (data)->
            $(".repo-title-edit").addClass("hide")
            $(".repo-title-show").find(".title").html(data.title)
            $(".repo-title-show").removeClass("hide")

  $(".glyphicon-comment").hover(
    ()->
      $("#description-popover").popover('show')
    ()->
      $("#description-popover").popover('hide')
    )          
