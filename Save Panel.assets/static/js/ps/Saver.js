//@include common.js
//@include constants.js

/*
 * Saver constructor.
 */
sp.Saver = function() { }

/**
 * Saves the active document.
 */
sp.Saver.prototype.save = function(options)
{
	var doc, formatOptions, workDir, name, dest, dup;

	if (0 == documents.length) {
		alert('Nothing to save.');
		return;
	}
	
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
	name       = options.filename.replace('$name', sp.basename(doc.name)); // Don't allow filenames longer than 255 characters.
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
	presets  = sp.loadPresets();
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

	current = new Folder(activeDocument.path);
	dirs    = path.substring(current.fullName.length).split(/[\/\\]/);

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

//preset = {
	//name: 'full',
	//path: 'jpeg/full',
	////outputFormats: { jpg: true, psd: true, png: true, webjpg: false },
	//outputFormats: { jpg: true, psd: false, png: false, webjpg: false },
	//jpegQuality: 11,
	//overwrite: false,
	//filename: '$name',
	//close: false,
	//action: {
		////type: SP_RESIZETOFIT,
		////type: SP_CUSTOMACTION,
		//type: SP_NOACTION,
		////args: [920, 2000]
		//args: ['Reimund', 'Look 1']
	//},
//}

//var s = new sp.Saver();
//s.save(preset);
