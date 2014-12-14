/*
 * Name: Save Panel CS5 Fix
 * Author: Reimund Trost (c) 2013
 * Email: reimund@lumens.se
 * Website: http://lumens.se/tools/savepanel/
 *
 * Description: Creates a file that contains the path to the Photoshop
 * preferences directory. This works around the problem that we cannot directly
 * communicate with a CS5 panel. Photoshop should run with administrator rights
 * when this file is executed.
 */

$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/common.js"); 

var maxPresets = 10;

function pathFix()
{
	var file = new File(app.path + '/Plug-ins/Panels/Save Panel/content/Save Panel.assets/Save Panel Settings Path.txt');

	if (file.open('w'))
		file.write(SP_SETTINGS_PATH);
	else {
		alert('Failed to apply CS5 fix. Did you forget to run Photoshop as administrator?');
		return false;
	}

	return true;
}

/**
 * Writes a number of scripts to disk that when executed saves according to the
 * different presets available.
 */
function presetFix()
{
	var dir, name, file, script;

	dir        = app.path + '/Presets/Scripts/Save Panel/';
	script     = new File(app.path + '/Presets/Scripts/Save Panel/Save Panel Only/Save Panel Preset.js');

	for (i = 0; i < maxPresets; i++) {
		name   = 'Save Panel Preset ' + i + '.js';
		script.copy(dir + name);
	}
}

presetFix();
if (pathFix())
	alert('Fix applied successfully. Please restart Photoshop.');
