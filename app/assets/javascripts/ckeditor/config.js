CKEDITOR.editorConfig = function(config) {
  config.toolbar = [ [ 'Source', 'Bold' ], ['CreatePlaceholder'] ];

  


  /* Filebrowser routes */
    // The location of an external file browser, that should be launched when "Browse Server" button is pressed.
    config.filebrowserBrowseUrl = "/ckeditor/attachment_files";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Flash dialog.
    config.filebrowserFlashBrowseUrl = "/ckeditor/attachment_files";

    // The location of a script that handles file uploads in the Flash dialog.
    config.filebrowserFlashUploadUrl = "/ckeditor/attachment_files";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Link tab of Image dialog.
    config.filebrowserImageBrowseLinkUrl = "/ckeditor/pictures";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Image dialog.
    config.filebrowserImageBrowseUrl = "/ckeditor/pictures";

    // The location of a script that handles file uploads in the Image dialog.
    config.filebrowserImageUploadUrl = "/ckeditor/pictures";

    // The location of a script that handles file uploads.
    config.filebrowserUploadUrl = "/ckeditor/attachment_files";

    // Rails CSRF token
    config.filebrowserParams = function(){
        var csrf_token = $('meta[name=csrf-token]').attr('content'),
                csrf_param = $('meta[name=csrf-param]').attr('content'),
                params = new Object();

        if (csrf_param !== undefined && csrf_token !== undefined) {
            params[csrf_param] = csrf_token;
        }

        return params;
    };

  config.toolbar = 'mini';

  config.removePlugins = 'elementspath';
  config.resize_enabled = false;
  config.extraPlugins = 'lineutils,widget,mathjax';
	config.toolbar_mini =
	[		
		['Bold','Italic','NumberedList','BulletedList','Outdent','Indent','mathjax','Image','Link','Unlink','SpecialChar','Table','Maximize']
	];
	
	config.toolbar_toolbarLight =
	[
			['Cut','Copy','Paste','PasteText','PasteFromWord','-','Scayt'],
			['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
			['Table','HorizontalRule','Smiley','SpecialChar', 'Link','Unlink','Anchor', 'Maximize'] ,
			'/',
			['Styles','Format','Font','FontSize', 'Bold','Italic','Strike','NumberedList','BulletedList','Outdent','Indent','Blockquote', 'TextColor','BGColor'],

	];

   config.toolbar_Fullx =
   [
      ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
      ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
      ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
      '/',
      ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
      ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
      ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
      ['Link','Unlink','Anchor'],
      ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar'],
      '/',
      ['Styles','Format','Font','FontSize'],
      ['TextColor','BGColor'],
      ['Maximize', 'ShowBlocks']
   ];

}
