//@include common.js
//@include settings.js
//@include constants.js

/*
 * Saver constructor.
 */
//sp = {};
sp.Saver = function() { }

/**
 * Saves the active document.
 */
sp.Saver.prototype.save = function(options)
{
	var doc, formatOptions, workDir, name, dest, dup;

	if (0 == documents.length)
		return;
	
	//if (undefined == options.suffix)
		//options.suffix = '';
	this.settings = options;

	formatOptions = {
		'jpg': this.getJpgSaveOptions(),
		'psd': this.getPsdSaveOptions(),
		'png': this.getPngSaveOptions(),
		'webjpg': this.getSfwSaveOptions()
	};

	doc        = activeDocument;
	root       = this.getRoot(options);
	name       = sp.basename(doc.name).substr(0, 254); // Don't allow filenames longer than 255 characters.
	destDir    = options.path;
	jpgsuffix  = '';

	if (sp.isRelative(options.path))
		destDir = root + '/' + destDir;

	if (options.overwrite)
		dest = destDir + '/' + name;
	else
		dest = sp.nextFilename(destDir, name, options.outputFormats, false);

	// Do we save two jpegs? Then add a suffix to the save for web file.
	if (options.outputFormats['jpg'] && options.outputFormats['webjpg'])
		jpgsuffix  = '_web';
	
	this.createDirectories(new File(dest).path);

	// This is a bit tricky, but works!
	if (!options.close)
		doc = doc.duplicate();

	this.applyAction(doc, options.action);

	for (format in options.outputFormats) {
		var fmtOptions = formatOptions[format];

		if (options.outputFormats[format])
			if ('webjpg' == format)
				doc.exportDocument(new File(dest + jpgsuffix + '.' + fmtOptions.extension), ExportType.SAVEFORWEB, fmtOptions);
			else
				doc.saveAs(new File(dest), fmtOptions, true, Extension.LOWERCASE);
	}

	doc.close(SaveOptions.DONOTSAVECHANGES);
}

sp.Saver.prototype.applyAction = function(doc, action)
{
	if (SP_NOACTION == action.type)
		return;
	else if (SP_RESIZETOFIT == action.type)
		this.resizeToFit(doc, action.args[0], action.args[1]);
	else if (SP_CUSTOMACTION == action.type)
		this.applyCustomAction(doc, action.args[0], action.args[1]);
}

sp.Saver.prototype.applyCustomAction = function(doc, set, action)
{
	var tmp        = activeDocument;
	activeDocument = doc;
	app.doAction(action, set);
	activeDocument = tmp;

}

sp.Saver.prototype.resizeToFit = function(doc, width, height)
{
	var docWidth, docHeight, scale, tmpHeight;

	docWidth  = parseFloat(doc.width);
	docHeight = parseFloat(doc.height);
	scale     = null;
	newWidth  = null;
	newHeight = null;
	
	// Is scaling needed?
	if (docWidth <= width && docHeight <= height)
		return;

	doc.flatten();

	// Get scale to fit width.
	if (docWidth > width)
		scale = width / docWidth;

	tmpHeight = Math.round(scale * docHeight);

	// Get scale to fit height.
	if (tmpHeight > height)
		scale *= (height / tmpHeight);

	newWidth  = scale * docWidth;
	newHeight = scale * docHeight;
		
	doc.resizeImage(newWidth, newHeight, null, preferences.interpolation);
}

/**
 * Try to work out the root directory.
 *
 * Looks through all presets and see if any of the directory patterns match the
 * location of the current document. If we get a match, we traverse back and
 * return the resulting directory.
 */
sp.Saver.prototype.getRoot = function(options)
{
	var root, docDir, presets, preset_dirs, real_dirs, traverse;

	docDir   = new Folder(activeDocument.path);
	root     = docDir;
	presets  = spSettings.presets;
	traverse = 0;

	for (i in presets) {
		preset_dirs = presets[i].path.split(/[\/\\]/);
		real_dirs   = docDir.fullName.split(/[\/\\]/);
		real_dirs.splice(0, real_dirs.length - preset_dirs.length);

		if (sp.arraysEqual(preset_dirs, real_dirs)) {
			traverse = preset_dirs.length;
			break;
		}
	}

	for (i = 0; i < traverse; i++)
		root = root.parent;

	return root;
}

sp.Saver.prototype.createDirectories = function(path)
{
	var dirs, current;

	dirs = path.split(/[\/\\]/);
	current = new Folder(dirs[0]);

	for (i in dirs) {
		current = new Folder(current.fullName + '/' + dirs[i]);
		if (!current.exists)
			current.create();
	}
}

sp.Saver.prototype.getJpgSaveOptions = function()
{
	var	options = new JPEGSaveOptions();
	options.embedColorProfile = true;
	options.formatOptions = FormatOptions.STANDARDBASELINE;

	options.matte = MatteType.NONE;
	options.quality = this.settings.jpegQuality;
	options.quality = 11;
	options.extension = 'jpg';
	return options;
}

sp.Saver.prototype.getPngSaveOptions = function()
{
	options = new PNGSaveOptions();
	options.interlaced = false;
	options.extension = 'png';
	return options;
}

sp.Saver.prototype.getPsdSaveOptions = function()
{
	var options = new PhotoshopSaveOptions();
	options.layers = true;
	options.embedColorProfile = true;
	options.annotations = true;
	options.alphaChannels = true;
	options.spotColors = true;
	options.extension = 'psd';
	return options;
}

sp.Saver.prototype.getSfwSaveOptions = function()
{
	var options = new ExportOptionsSaveForWeb();
	options.format = SaveDocumentType.JPEG;
	options.includeProfile = true;
	options.quality = parseInt(this.settings.jpegQuality / 12 * 100);
	options.extension = 'jpg';
	return options;
}

/**
 * Strips the extension of a filename string.
 */
//sp.basename = function(file)
//{
	//return file.replace(/\.[^\..]+$/, '');
//}

/**
 * Gets the extension part of the specified filename string.
 */
//sp.extension = function(file)
//{
	//return file.match(/\.([^\..]+)$/);
//}

/**
 * Test array equality.
 */
//sp.arraysEqual = function(arr1, arr2) {
    //if (arr1.length !== arr2.length)
        //return false;

    //for (var i = arr1.length; i--;)
        //if (arr1[i] !== arr2[i])
            //return false;

    //return true;
//}

//sp.isRelative = function(path)
//{
	//if ('/' == path[0] || (':' == path[1] && '\\' == path[2]))
		//return false;
	//return true;
//}

/**
 * Gets the next available file name by increasing a trailing sequential
 * number.
 */
//sp.nextFilename = function(directory, basename, formats, alwaysPad)
//{
	//var padding, collision, file;

	//if (alwaysPad) {
		//padding = '1';
		//separator = '_'
	//} else
		//padding = separator = ''

	//while(true) {
		//collision = false;

		//for (extension in formats) {
			//file = new File(directory + '/' + basename + separator + padding + '.' + extension);
			//if (file.exists) {
				//collision = true;
				
				//if (!alwaysPad && '' == padding) {
					//padding = '0';
					//separator = '_';
				//}
				//break;
			//}
		//}

		//// Increase the sequential number by 1 if there is a filename
		//// collision.
		//if (collision)
			//padding = sp.zeroPad(Number(padding) + 1, 1);
		//else
			//break;
	//}

	//return directory + '/' + basename + separator + padding;
//}

/**
 * Pads the given number n with l zeroes.
 */
//sp.zeroPad = function(n, l)
//{
	//n = n.toString();
	//l = Number(l);
	//var pad = '0';
	//while (n.length < l) {n = pad + n;}
	//return n;
//}

var spSettings = spGetSettings();

preset = {
	name: '920',
	path: 'jpeg/920',
	outputFormats: { jpg: true, psd: true, png: true, webjpg: false },
	jpegQuality: 11,
	overwrite: false,
	close: false,
	action: {
		//type: SP_RESIZETOFIT,
		type: SP_CUSTOMACTION,
		//type: SP_NOACTION,
		//args: [920, 2000]
		args: ['Reimund', 'Look 1']
	},
}

var s = new sp.Saver();
s.save(preset);
