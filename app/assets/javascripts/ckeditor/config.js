CKEDITOR.editorConfig = function(config) {
	config.toolbar = [ [ 'Source', 'Bold' ], ['CreatePlaceholder'] ];

 config.toolbar = 'toolbar_mini';

config.removePlugins = 'elementspath' ;
config.resize_enabled = false;

	config.toolbar_mini =
	[		
		['Bold','Italic','Strike','NumberedList','BulletedList','Outdent','Indent','Blockquote', 'TextColor','BGColor']
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
