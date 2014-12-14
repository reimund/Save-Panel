var SP_NOACTION      = 0;
var SP_RESIZETOFIT   = 1;
var SP_CUSTOMACTION  = 2;
var SP_HISTORY_STATE = 'Apply save preset';
var SP_SETTINGS_PATH = new File(app.preferencesFolder + '/Save%20Panel/').fsName + '/';

function spActionToString(action)
{
	if (SP_NOACTION == action)
		return 'Nothing';
	else if (SP_RESIZETOFIT == action)
		return 'Resize to fit';
	else if (SP_CUSTOMACTION == action)
		return 'Custom action';
	
	return false;
}
