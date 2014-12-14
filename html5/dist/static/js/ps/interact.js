/**
 * Communicate back to the web app.
 */

var extensionRoot = (new File($.fileName)).parent + '/';

$.evalFile(extensionRoot + '/constants.js'); 
$.evalFile(extensionRoot + '/Json.js'); 
$.evalFile(extensionRoot + '/Saver.js'); 

function getSettingsPath()
{
	return SP_SETTINGS_PATH;
}

function save(args)
{
	var preset, s;

	preset = Json.eval(args[0]);
	s      = new sp.Saver();
	return Json.encode(s.save(preset));
}

function serializeUi(args)
{
	var file, collapsed;

	file = new File(SP_SETTINGS_PATH + 'ui.json');
	collapsed = [];

	for (i in args[0])
		collapsed.push(args[0][i]);

	if (file.open('w')) {
		file.writeln(Json.encode({ collapsed: collapsed }));
	}
}
