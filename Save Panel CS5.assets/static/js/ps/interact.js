/**
 * Communicate back to the web app.
 */

$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/constants.js"); 
$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/Json.js"); 
$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/Saver.js"); 

function getSettingsPath()
{
	return SP_SETTINGS_PATH;
}


function save(args)
{
	var preset, s;

	preset = Json.eval(args[0]);
	s      = new sp.Saver();
	return s.save(preset);
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
