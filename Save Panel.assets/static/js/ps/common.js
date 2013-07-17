/*
 * Saver constructor.
 */
sp = {};

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
