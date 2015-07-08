/**
 * CS5 only.
 */
$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/common.js"); 
$.evalFile(app.path + "/Plug-ins/Panels/Save%20Panel/content/Save%20Panel.assets/static/js/ps/Saver.js"); 

var preset, s;

preset = sp.scriptToPreset(getScriptPath());
s      = new sp.Saver();

s.save(preset);

function getScriptPath()
{
	var where;

	try {
		var forcedError = FORCEDRRROR;
	} catch(e) {
		where = e.fileName;
	}

	return where;
}
