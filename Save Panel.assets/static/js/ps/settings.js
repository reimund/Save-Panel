//@include PSSettings.js
//@include constants.js

// Set defaults.
var defaults, settings;

defaults = {
	presets: [
		{
			name: '820',
			path: 'jpeg/820',
			heading: 'Save Jpeg',
			outputFormats: { jpg: false, psd: false, png: false, webjpg: true },
			jpegQuality: 10,
			overwrite: true,
			close: false,
			action: {
				type: SP_RESIZETOFIT,
				args: [820, 2000],
			},
		},
		{
			name: '920',
			path: 'jpeg/920',
			heading: 'Save Jpeg',
			outputFormats: { jpg: false, psd: false, png: false, webjpg: true },
			jpegQuality: 10,
			overwrite: true,
			close: false,
			action: {
				type: SP_RESIZETOFIT,
				args: [920, 2000],
			},
		},
		{
			name: 'Full',
			path: 'jpeg/full',
			heading: 'Save Jpeg',
			outputFormats: { jpg: true, psd: false, png: false, webjpg: false },
			jpegQuality: 12,
			overwrite: true,
			close: false,
			action: {
				type: SP_NOACTION,
				args: [920, 2000],
			},
		},
		{
			name: 'Psd',
			path: 'psd',
			heading: 'Save Psd',
			outputFormats: { jpg: false, psd: true, png: false, webjpg: false },
			jpegQuality: 10,
			overwrite: true,
			close: false,
			action: {
				type: SP_NOACTION,
				args: [920, 2000],
			},
		}
	],
};

settings = new Settings();
settings.setUID("SavePanelSettingsUniqueId");
settings.setMSG("SavePanelSettings");
settings.setType(SettingsType.SINGLE);
settings.loadSettings();

/**
 * Loads settings.
 */
function spGetSettings()
{
	var spSettings;

	if (0 < settings.numEntries())
		spSettings = settings.getEntryAt(0);
	
	if (spSettings == undefined)
		spSettings = {};

	for (setting in defaults)
		if (undefined == spSettings[setting])
			spSettings[setting] = defaults[setting];

	return spSettings;
}
