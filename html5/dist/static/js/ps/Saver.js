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
	var self, doc, root, name, destDir, formats, workDir, dest, dup, beforeState, f, jpgSuffix, savedFiles, relDest, result;

	if (0 == documents.length) { 
		if (13 > parseFloat(app.version))
			alert('Nothing to save.');
		return [{ success: false, message: 'Nothing to save' }];
	}
	
	self          = this;
	self.settings = options;

	formats = {
		'jpg': self.getJpgSaveOptions(),
		'psd': self.getPsdSaveOptions(),
		'png': self.getPngSaveOptions(),
		'webjpg': self.getSfwSaveOptions()
	};

	doc       = activeDocument;
	name      = options.filename.replace('$name', sp.basename(doc.name)); // Don't allow filenames longer than 255 characters.
	destDir   = self.getDestDir(options.path);
	result    = [];

	if (!destDir)
		return alert('Cannot save an unsaved document to a relative path.');

	if (options.overwrite)
		dest = destDir + '/' + name;
	else
		dest = sp.nextFilename(destDir, name, options.outputFormats, false);
	
	relDest = options.path + '/' + new File(dest).name;
	self.createDirectories(destDir);

	// Remember what state we were in before resizing.
	// If we've already applied a save preset use the state before the last
	// state.
	if (doc.historyStates[doc.historyStates.length - 1].toString() == '[HistoryState ' + SP_HISTORY_STATE + ']')
		beforeState = doc.historyStates.length - 2;
	else
		beforeState = doc.historyStates.length - 1;

	f = function() {
		var formatOptions, formatDest;

		self.applyAction(doc, options.action);

		for (format in options.outputFormats) {
			formatOptions = formats[format];
			formatDest    = dest;
			jpgSuffix     = '';
			
			if (options.outputFormats[format]) {
				// Do we save two jpegs? Then add a suffix to the save for web file.
				if ('webjpg' == format && options.outputFormats['jpg'])
					jpgSuffix = '_web';

				formatDest = dest + jpgSuffix + '.' + formatOptions.extension;

				self.saveFile(formatOptions, formatDest);

				result.push({ success: true, message: relDest + jpgSuffix + '.' + formatOptions.extension });
			}
		}
	}

	doc.suspendHistory(SP_HISTORY_STATE, 'f()');

	// Restore the state.
	doc.activeHistoryState = doc.historyStates[beforeState];

	if (options.close)
		doc.close(SaveOptions.DONOTSAVECHANGES);
	

	return result;
}

sp.Saver.prototype.saveFile = function(format, dest)
{
	if ('ExportOptionsSaveForWeb' == format.typename)
		activeDocument.exportDocument(new File(dest), ExportType.SAVEFORWEB, format);
	else
		activeDocument.saveAs(new File(dest), format, true, Extension.LOWERCASE);
}

sp.Saver.prototype.getDestDir = function(targetPath)
{
	var basePath;

	try {
		if ('psd' == sp.extension(activeDocument.fullName.name))
			basePath = this.getOriginalDir(activeDocument.path);
		else
			basePath = activeDocument.path;
	} catch (e) {
		if (sp.isRelative(targetPath))
			return false;
	}

	if (sp.isRelative(targetPath) && '/' != basePath)
		return basePath + '/' + targetPath;
	else
		return targetPath;
}

/**
 * Try to work out the directory of the original file.
 *
 * Looks through all presets and see if any of the directory patterns match the
 * location of the current document. If we get a match, we traverse back and
 * return the resulting directory.
 */
sp.Saver.prototype.getOriginalDir = function()
{
	var docDir, root, presets, presetDirs, realDirs, traverse;

	try {
		docDir = new Folder(activeDocument.path);
	} catch (e) {
		return false;
	}

	root     = docDir;
	presets  = sp.loadPresets();
	traverse = 0;

	for (i in presets) {
		if(!sp.isRelative(presets[i].path))
			continue;

		presetDirs = presets[i].path.split(/[\/\\]/);
		realDirs   = docDir.fullName.split(/[\/\\]/);
		realDirs.splice(0, realDirs.length - presetDirs.length);

		if (sp.arraysEqual(presetDirs, realDirs)) {
			traverse = presetDirs.length;
			break;
		}
	}

	for (i = 0; i < traverse; i++)
		root = root.parent;

	return root;
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
	var docWidth, docHeight, scale, tmpHeight, rulerUnits;

	// Temporary set units to pixels.
	rulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

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

	// Restore ruler units.
	preferences.rulerUnits = rulerUnits;
}

sp.Saver.prototype.createDirectories = function(path)
{
	var dirs, current;

	dirs = path.split(/[\/\\]/);

	// Take care of network paths on Windows beginning with a double-slash.
	if ('' == dirs[0] && '' == dirs[1]) {
        dirs[2] = '/' + dirs[2];
        dirs.shift();
        dirs.shift();
	}

	current = new Folder('/' + dirs[0]);

	for (i = 1; i < dirs.length; i++) {
		current = new Folder(current.fullName + '/' + dirs[parseInt(i)]);
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
	options.compression = 5;
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

//presets = sp.loadPresets();
//for (i in presets) {
	//if ('Desktop' == presets[i].name)
		//preset = presets[i];
//}

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
