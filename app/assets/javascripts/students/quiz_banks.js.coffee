# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

jQuery ->

  $(".quiz-footer").on "click",".submit-answer",(e)->
    e.preventDefault()
    question_id = $(".question").data("id")
    question_type = $(".question-type").val()
    served_quiz_id = $(".served-quiz").val()
    redirect = 0
    console.log($(".question-number-text").val())
    console.log($(".total-questions-text").val())
    console.log($(".question-number-text").val() == $(".total-questions-text").val())
    if $(".question-number-text").val() == $(".total-questions-text").val()
      redirect = 1
    if(question_type == '1')
      if($(".true-option").is(":checked"))
        answer = "true"
      if($(".false-option").is(":checked"))
        answer = "false"    
    if(question_type == '2')
      answer = $(".mcq-option:checked").data("answer")
    if(question_type == '3')
      answer = $(".open-end-field").val()
    if(question_type == '4')
      answer = $(".blank-field").val()
    params = {question_id: question_id, answer: answer,served_quiz_id: served_quiz_id}
    $.ajax
      url: "/students/quiz_banks/check_answer",
      data: params,
      method: "POST",
      success: (data)->
        console.log redirect
        if redirect == 1
          window.location = "/students/quiz_banks/answer_sheet?served_quiz_id="+served_quiz_id
        else
          $(".question-html").html($(data).find('.question-html').html())
