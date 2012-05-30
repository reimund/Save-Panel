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
	var doc, format_options, name, current_file_dir, rel_dest, path, ext;

	if (0 == documents.length)
		return;

	if (undefined == options.suffix)
		options.suffix = '';

	format_options = {
		'jpg': this.get_jpeg_save_options(),
		'psd': this.get_psd_save_options(),
		'webjpg': this.get_sfw_save_options()
	};

	doc = activeDocument;
	current_file_dir = new File(doc.fullName).parent;
	ext = extension(doc.fullName.name)[1];
	name = basename(doc.name);


	rel_dest = ext == 'psd'
		? '/../jpeg/' + options.size  + '/' : '/jpeg/' + options.size + '/';
	
	if (ext == 'psd')
		rel_dest = '/../jpeg/' + options.size + '/';
	else if (options.format == 'psd')
		rel_dest = '/psd/';
	else
		rel_dest = '/jpeg/' + options.size + '/';

	// Resize if needed.
	if (options.size != 'full') {
		doc.flatten();
		doc.resizeImage(Number(options.size), null, null, ResampleMethod.BICUBIC);
	}
		
	// Create directories
	if (options.format == 'psd') {
		if (!(psd_folder = new Folder(current_file_dir + '/psd')).exists) {
			psd_folder.create();
		}
	} else {
		if (!(jpeg_folder = new Folder(current_file_dir + '/jpeg')).exists)
			jpeg_folder.create();
		if (!(size_folder = new Folder(current_file_dir + rel_dest)).exists)
			size_folder.create();
	}
		
	// Target path.
	path = current_file_dir + rel_dest + name + options.suffix;
	
	if (options.format == 'webjpg')
		doc.exportDocument(new File(path + '.jpg'), ExportType.SAVEFORWEB, format_options[options.format]);
	else
		doc.saveAs(new File(path), format_options[options.format], true, Extension.LOWERCASE);
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



Saver.prototype.get_sfw_save_options = function()
{
	var options = new ExportOptionsSaveForWeb();
	options.format = SaveDocumentType.JPEG;
	options.includeProfile = true;
	options.quality = 80;
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
