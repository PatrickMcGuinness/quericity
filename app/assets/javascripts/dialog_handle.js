CKEDITOR.on('dialogDefinition', function (e) {
    var dialogName = e.data.name;
    var dialog = e.data.definition.dialog;
    dialog.on('show', function () {
    	$("#base-modal").hide()
        
    });
    dialog.on('hide', function () {
    	$("#base-modal").show()
    });
});