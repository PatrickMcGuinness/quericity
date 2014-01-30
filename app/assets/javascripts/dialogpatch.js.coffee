# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
    
CKEDITOR.on 'dialogDefinition', (e)->
    dialogName = e.data.name;
    dialog = e.data.definition.dialog;
    dialog.on 'show', (e) ->
      $("#base-modal").hide()
        
    dialog.on 'hide', (e) ->
      $("#base-modal").show()