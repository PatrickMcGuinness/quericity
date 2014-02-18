# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

jQuery ->

  $(".quiz-footer").on "click",".submit-answer",(e)->
    question_id = $(".question").data("id")
    question_type = $(".question-type").val()
    served_quiz_id = $(".served-quiz").val()
    if(question_type == '1')
      if($(".true-option").is(":checked"))
        answer = "true"
        question_option_id = 0
      if($(".false-option").is(":checked"))
        answer = "false"
        question_option_id = 0    
    if(question_type == '2')
      question_option_id = $(".mcq-option:checked").parents(".question_option").data("id")
      answer = $(".mcq-option:checked").data("answer")
    if(question_type == '3')
      console.log $(".question").data("id")
    if(question_type == '4')
      answer = $(".blank-field").val()
      question_option_id = 0
    params = {question_id: question_id, answer: answer, question_option_id: question_option_id, served_quiz_id: served_quiz_id}
    console.log params
    $.ajax
      url: "/students/quiz_banks/check_answer",
      data: params,
      method: "POST",
      success: (data)->
        $(".question-html").html($(data).find('.question-html').html())
