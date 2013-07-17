/*
 * Saver constructor.
 */
sp = {};

sp.presetsFile = new File(app.path + '/Plug-Ins/Panels/Save%20Panel/content/Save%20Panel.assets/presets.json');

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
	return file.match(/\.([^\..]+)$/);
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
	if ('/' == path[0] || (':' == path[1] && '\\' == path[2]))
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

		// Increase the sequential number by 1 if there is a filename
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
 * Load presets from presets.json, located in '<Panel directory>/content'.
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
 * Save the specified presets to presets.json.
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


