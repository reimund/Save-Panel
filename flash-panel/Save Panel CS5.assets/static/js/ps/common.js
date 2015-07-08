//@include constants.js
//@include Json.js

/*
 * Saver constructor.
 */
sp = {};

sp.presetsFolder = new Folder(SP_SETTINGS_PATH);
sp.presetsFile   = new File(SP_SETTINGS_PATH + '/presets.json');
sp.presetsFolder.create();

/**
 * Strips the extension of a filename string.
 */
sp.basename = function(file)
{
	return file.replace(/\.[^\..]+$/, '');
}

/**
 * Gets the extension part of the specified filename string.
 */
sp.extension = function(file)
{
	var matches = file.match(/\.([^\..]+)$/);
	return (matches != null && matches.length > 1) ? matches[1] : false;
}

/**
 * Test array equality.
 */
sp.arraysEqual = function(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;

    for (var i = arr1.length; i--;)
        if (arr1[i] !== arr2[i])
            return false;

    return true;
}

sp.isRelative = function(path)
{
	if ('/' == path[0] || '~' == path[0] || (':' == path[1] && '\\' == path[2]))
		return false;
	return true;
}

/**
 * Gets the next available file name by increasing a trailing sequential
 * number.
 */
sp.nextFilename = function(directory, basename, formats, alwaysPad)
{
	var padding, collision, file;

	if (alwaysPad) {
		padding = '1';
		separator = '_'
	} else
		padding = separator = ''

	while(true) {
		collision = false;

		for (extension in formats) {
			file = new File(directory + '/' + basename + separator + padding + '.' + extension);
			if (file.exists) {
				collision = true;
				
				if (!alwaysPad && '' == padding) {
					padding = '0';
					separator = '_';
				}
				break;
			}
		}

		// IncreasepresetId the sequential number by 1 if there is a filename
		// collision.
		if (collision)
			padding = sp.zeroPad(Number(padding) + 1, 1);
		else
			break;
	}

	return directory + '/' + basename + separator + padding;
}

/**
 * Pads the given number n with l zeroes.
 */
sp.zeroPad = function(n, l)
{
	n = n.toString();
	l = Number(l);
	var pad = '0';
	while (n.length < l) {n = pad + n;}
	return n;
}

/**
 * Loads presets from presets.json, located in '<Panel directory>/content'.
 */
sp.loadPresets = function()
{
	var json;
	
	if (sp.presetsFile.open('r')) {
		json = Json.eval(sp.presetsFile.readln());
		sp.presetsFile.close();
		return json['presets'];
	}
	
	return [];
}

/**
 * Saves the specified presets to presets.json.
 */
sp.savePresets = function(presets)
{
	var self, json;

	self = this;
	json = Json.encode({ presets: presets });
	
	if (sp.presetsFile.open('w')) {
		sp.presetsFile.writeln(json);
		return true;
	}

	return false;
}

/**
 * Maps a numbered script to a preset.
 *
 * CS5 only.
 */
sp.scriptToPreset = function(script) {

	var whereAmI, parts, presetId, presets;

	scriptParts = script.split('%20');
	presetId    = Number(scriptParts[scriptParts.length - 1].replace('.js', ''));
	presets     = sp.loadPresets();

	return presets[presetId];
}
