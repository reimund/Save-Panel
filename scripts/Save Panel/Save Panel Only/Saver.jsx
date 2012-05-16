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
	var format_options, name, dir, path;

	if (0 == documents.length)
		return;

	format_options = {
		'jpg': this.get_jpeg_save_options(),
		'psd': this.get_psd_save_options()
	};

	dir = new File(activeDocument.fullName).parent;
	name = basename(activeDocument.name);

	if (options.type == 'normal')
		path = dir + '/jpeg/full/' + name;
	else
		path = dir + '/jpeg/full/' + name + '_bw';

	activeDocument.saveAs(new File(path), format_options['jpg'], true, Extension.LOWERCASE);

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
 * Strips the extension of filename string.
 */
function basename(file)
{
	return file.replace(/\.[^\..]+$/, '');
}



s = new Saver();
