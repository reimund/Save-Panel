//@include constants.jsx

/*
 * Saver constructor.
 */
var Saver = function() { }


/**
 * Saves the active document.
 */
Saver.prototype.save = function(options)
{
	var format_options, name, current_file_dir, rel_dest, path, ext;

	if (0 == documents.length)
		return;

	format_options = {
		'jpg': this.get_jpeg_save_options(),
		'psd': this.get_psd_save_options()
	};

	current_file_dir = new File(activeDocument.fullName).parent;
	ext = extension(activeDocument.fullName.name)[1];
	name = basename(activeDocument.name);

	rel_dest = ext == 'psd'
		? '/../jpeg/full/' : '/jpeg/full/';
		

	if (options.type == 'normal' && options.format == 'jpg')
		path = current_file_dir + rel_dest + name;
	else if (options.format == 'psd')
		path = current_file_dir + '/psd/' + name;
	else
		path = current_file_dir + rel_dest + name + '_bw';

	activeDocument.saveAs(new File(path), format_options[options.format], true, Extension.LOWERCASE);
}


Saver.prototype.get_jpeg_save_options = function()
{
	var	options = new JPEGSaveOptions();
	options.embedColorProfile = true;
	options.formatOptions = FormatOptions.STANDARDBASELINE;
	options.matte = MatteType.NONE;
	//options.quality = this.settings.jpeg_quality;
	options.quality = 11;
	return options;
}


Saver.prototype.get_psd_save_options = function()
{
	var options = new PhotoshopSaveOptions();
	options.layers = true;
	options.embedColorProfile = true;
	options.annotations = true;
	options.alphaChannels = true;
	options.spotColors = true;
	return options;
}


/**
 * Strips the extension of a filename string.
 */
function basename(file)
{
	return file.replace(/\.[^\..]+$/, '');
}


/**
 * Gets the extension part of the specified filename string.
 */
function extension(file)
{
	return file.match(/\.([^\..]+)$/);
}



s = new Saver();
