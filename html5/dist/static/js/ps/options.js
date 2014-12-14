/*
 * Name: Save Panel Options
 * Author: Reimund Trost (c) 2013
 * Email: reimund@lumens.se
 * Website: http://lumens.se/tools/savepanel/
 *
 * Description: Options dialog for the Save Panel script.
 */


//@include common.js
//@include constants.js
//@include actions.js
//@include Json.js

setupEventHelper();

var SavePanelOptions = function()
{
	var windowRes = "dialog { \
		orientation: 'row', \
		alignChildren: 'top', \
		mainGroup: Group { \
			orientation: 'row', \
			savedPresets: Panel { \
				orientation: 'column', \
				preferredSize: [200, 240], \
				alignChildren: 'left', \
				text: 'Saved presets', \
				presets: Group { \
				}, \
				buttons: Group { \
					create: Button { \
						preferredSize: [30, 23], \
						text: '+' \
					}, \
					remov: Button { \
						preferredSize: [30, 23], \
						text: '-' \
					}, \
					copyGroup: Group { \
						margins: [100, 0, 0 ,0], \
						orientation: 'row', \
						preferredSize: [130, 23], \
						copy: Button { \
							preferredSize: [50, 23], \
							text: 'Copy' \
						}, \
					}, \
				} \
			}\
			editPreset: Panel { \
				preferredSize: [540, 20], \
				alignChildren: 'left', \
				text: 'Edit preset', \
				g1: Group { \
					orientation: 'row', \
					margins: [0, 0, 0 ,0], \
					s1: StaticText { text: 'Name', preferredSize: [58, 16] }, \
					nameGroup: Group { \
						margins: [0, 14, 0 ,0], \
						orientation: 'column', \
						alignChildren: 'left', \
						e: EditText { characters: 20 }, \
						g: Group { \
							margins: [0, -6, 0 ,0], \
							preferredSize: [100, 5], \
							help: StaticText { text: 'Appears on button.' }, \
						}, \
					}, \
					headingGroup: Group { \
						s: StaticText { text: 'Heading', preferredSize: [55, 16] }, \
						e: EditText { characters: 15 } \
					} \
				}, \
				g2: Group { \
					orientation: 'row', \
					margins: [0, -10, 0 ,0], \
					s2: StaticText { text: 'Directory', preferredSize: [58, 16] }, \
					pathGroup: Group { \
						margins: [0, 14, 0 ,0], \
						orientation: 'column', \
						alignChildren: 'left', \
						e: EditText { characters: 50, }, \
						g: Group { \
							margins: [0, -6, 0 ,0], \
							preferredSize: [100, 5], \
							help: StaticText { text: 'Absolute or relative path. Leave empty (or use \".\") to save in the same directory.' }, \
						}, \
					}, \
					browse: Button { text: 'Browse...' }, \
				}\
				sep1: Panel { preferredSize: [540, 1] }, \
				action: Group { \
					orientation: 'row', \
					margins: [0, 0, 0, 0], \
					s: StaticText { text: 'Before saving, do' }, \
					dropdown: DropDownList { } \
				}\
				sep2: Panel { preferredSize: [540, 1] }, \
				saveTypes: Group { \
					jpeg: Checkbox { \
						preferredSize: [50, 16], \
						text: 'Jpeg', \
					}, \
					webjpeg: Checkbox { \
						preferredSize: [140, 16], \
						text: 'Jpeg (save for web)', \
					}, \
					png: Checkbox { \
						preferredSize: [50, 16], \
						text: 'Png', \
					}, \
					psd: Checkbox { \
						preferredSize: [50, 16], \
						text: 'Psd', \
					}, \
					margins: [0, 20, 0, 0], \
				}, \
				quality: Group { \
					label: StaticText { \ text: 'JPEG Quality' \ }, \
					slider: Slider { \
						minvalue: 0, \
						maxvalue: 12, \
					}, \
					e: EditText { \
						preferredSize: [35, 20], \
					}, \
				}, \
				closeWhenSaved: Group { \
					c: Checkbox { \
						text: 'Close when saved', \
						value: false, \
						helpTip: 'Close the file after its\\'s been saved.', \
					}, \
				} \
				overwrite: Group { \
					c: Checkbox { \
						text: 'Overwrite existing files', \
						value: true, \
						helpTip: 'Pads the target file if left unchecked.', \
					}, \
				} \
				filename: Group { \
					s1: StaticText { text: 'Filename', helpTip: '$name will be replaced with the original filename (without extension).', }, \
					e: EditText { characters: 20, text: '$name', helpTip: '$name will be replaced with the original filename (without extension).' }, \
					s2: StaticText { bounds: [0, 0, 300, 16] }, \
				}, \
				buttonGroup: Group { \
					margins: [0, 20, 0, 0], \
					orientation: 'row', \
					s: StaticText { text: 'Saved.', visible: false }, \
					g: Group { \
						orientation: 'column', \
						alignChildren: 'right', \
						margins: [440, 0, 0, 0], \
						g: Group { \
							orientation: 'row', \
							save: Button { text: 'Save' }, \
						}, \
					}, \
				}, \
			}, \
		}, \
		buttonGroup: Group { \
			orientation: 'column', \
			okButton: Button { text: 'Ok' }, \
			cancelButton: Button { text: 'Cancel' } \
		}, \
	}";

	this.w       =  new Window(windowRes, 'Save Panel Options');
	this.presets = sp.loadPresets();

	this.setupUi();
	this.w.show();

}

SavePanelOptions.prototype.presetFromSettings = function()
{
	var panel  = this.w.mainGroup.editPreset
	  , preset = null
	  , action = {
			type: SP_NOACTION,
			args: [],
		}
	;

	if (spActionToString(SP_RESIZETOFIT) == panel.action.dropdown.selection.text) {
		action = {
			type: SP_RESIZETOFIT,
			args: [parseInt(panel.action.actionArgs.e1.text), parseInt(panel.action.actionArgs.e2.text)],
		}
	} else if (spActionToString(SP_CUSTOMACTION) == panel.action.dropdown.selection.text) {
		action = {
			type: SP_CUSTOMACTION,
			args: [panel.action.actionArgs.sets.selection.text, panel.action.actionArgs.actions.selection.text]
		}
	}
	
	preset = {
		heading: panel.g1.headingGroup.e.text,
		name: panel.g1.nameGroup.e.text,
		path: panel.g2.pathGroup.e.text,
		outputFormats: {
			jpg: panel.saveTypes.jpeg.value,
			webjpg: panel.saveTypes.webjpeg.value,
			png: panel.saveTypes.png.value,
			psd: panel.saveTypes.psd.value,
		},
		jpegQuality: parseInt(panel.quality.e.text),
		close: panel.closeWhenSaved.c.value,
		overwrite: panel.overwrite.c.value,
		filename: panel.filename.e.text,
		action: action,
	};

	if ('' == preset.heading || '' == preset.name) {
		alert('You must specify at least \'name\' and \'heading\'');
		return false;
	}

	return preset;
}

SavePanelOptions.prototype.setupUi = function()
{
	var panel      = this.w.mainGroup.editPreset
	  , listPanel  = this.w.mainGroup.savedPresets
	  , presets    = this.presets
	  , smallFont  = ScriptUI.newFont(this.w.graphics.font.name, ScriptUI.FontStyle.REGULAR, 10)
	  , actions    = [SP_NOACTION, SP_RESIZETOFIT, SP_CUSTOMACTION];

	listPanel.list = listPanel.presets.add(
		"ListBox { \
			bounds: [10, 10, 240, 352], \
			properties: { \
				numberOfColumns: 1, \
				showHeaders: false, \
				columnTitles: ['Preset'], \
			}, \
		}"
	);

	for (var i in actions)
		this.w.mainGroup.editPreset.action.dropdown.add('item', spActionToString(actions[i]));

	for (var i in presets)
		this.addPreset(presets[i]);

	// Set small font for help label.
	this.w.mainGroup.editPreset.g2.pathGroup.g.help.graphics.font 
		= this.w.mainGroup.editPreset.g1.nameGroup.g.help.graphics.font 
		= smallFont;

	panel.quality.slider.enabled    = panel.saveTypes.jpeg.value || panel.saveTypes.webjpeg.value;
	panel.quality.e.enabled         = panel.saveTypes.jpeg.value || panel.saveTypes.webjpeg.value;
	panel.action.dropdown.selection = panel.action.dropdown.items[0];

	this.setupEvents();

	listPanel.list.selection        = 0;
	panel.filename.s2.text          = this.getFilename();
	panel.quality.e.text            = 10;
	panel.quality.slider.value      = panel.quality.e.text;
	panel.quality.e.notify('onChange');

	this.w.layout.layout(true);
}

SavePanelOptions.prototype.getFilename = function()
{
	if (documents.length < 1)
		return '';

	var types = this.w.mainGroup.editPreset.saveTypes
	  , ext   = 'jpg'
	  , regex = this.w.mainGroup.editPreset.filename.e.text
	  , name  = sp.basename(activeDocument.name).substr(0, 254)
	;

	if (types.jpeg.value || types.webjpeg.value)
		ext = 'jpg';
	else if (types.psd.value)
		ext = 'psd';
	else if (types.png.value)
		ext = 'png';

	return regex.replace('$name', name) + '.' + ext;
}

SavePanelOptions.prototype.setupEvents = function()
{
	var self      = this
	  , panel     = self.w.mainGroup.editPreset
	  , listPanel = self.w.mainGroup.savedPresets
	;

	panel.action.dropdown.onChange   = self.changeAction;
	panel.g1.nameGroup.e.onChange    = function(e) { self.changed(); };
	panel.g1.headingGroup.e.onChange = function(e) { self.changed(); };
	panel.g2.pathGroup.e.onChange    = function(e) { self.changed(); };
	panel.g2.browse.onClick          = function(e) { self.changed(); panel.g2.pathGroup.e.text = (f = Folder.selectDialog('Please select a directory.')) == null ? '' : f.fsName; };
	panel.closeWhenSaved.c.onClick   = function(e) { self.changed(); };
	panel.overwrite.c.onClick        = function(e) { self.changed(); };
	panel.filename.e.onChanging      = function(e) { self.changed(); };
	panel.saveTypes.psd.onClick      = function(e) { self.changed(); };
	panel.saveTypes.png.onClick      = function(e) { self.changed(); };
	panel.saveTypes.jpeg.onClick     = function(e) { self.changed(); panel.quality.e.enabled    = panel.quality.slider.enabled = this.value || panel.saveTypes.webjpeg.value; };
	panel.saveTypes.webjpeg.onClick  = function(e) { self.changed(); panel.quality.e.enabled    = panel.quality.slider.enabled = this.value || panel.saveTypes.jpeg.value; };
	panel.quality.slider.onChange    = function(e) { self.changed(); panel.quality.e.text       = Math.round(this.value); };
	panel.quality.slider.onChanging  = function(e) { self.changed(); panel.quality.e.text       = Math.round(this.value); };
	panel.quality.e.onChange         = function(e) { self.changed(); panel.quality.slider.value = Math.round(Number(this.text)); };

	panel.buttonGroup.g.g.save.onClick = function(e)
	{
		self.changed();
		if (self.presets.length == 0)
			listPanel.buttons.create.notify('onClick');
			
		panel.buttonGroup.s.visible = self.updatePreset();
	};

	listPanel.buttons.create.onClick = function(e)
	{
		var defaultPreset = {
			heading: 'Default',
			name: 'New save preset',
			path: '',
			outputFormats: {
				jpg: false,
				webjpg: false,
				png: false,
				psd: false,
			},
			jpegQuality: 10,
			close: false,
			overwrite: true,
			filename: '$name',
			action: {
				type: SP_NOACTION,
				args: [],
			}
		};

		self.changed();
		panel.index = listPanel.list.items.length;
		self.addPreset(defaultPreset);
		listPanel.list.selection = listPanel.list.items.length - 1;
		panel.buttonGroup.g.g.save.notify('onClick');
	};

	listPanel.buttons.copyGroup.copy.onClick = function(e)
	{
		self.changed();
		panel.index = listPanel.list.items.length;
		self.addPreset(self.presetFromSettings());
		listPanel.list.selection = listPanel.list.items.length - 1;
		panel.buttonGroup.g.g.save.notify('onClick');
	}

	listPanel.list.onChange                 = function(e) { self.redrawPreset(self.presets[listPanel.list.selection.index]); self.changed(); };
	listPanel.buttons.remov.onClick         = function(e) { self.removePreset(self.currentPreset); self.changed(); };
	self.w.buttonGroup.cancelButton.onClick = function(e) { self.w.close(2); };

	self.w.buttonGroup.okButton.onClick = function(e)
	{
		sp.savePresets(self.presets);
		self.serializeInterface();
		self.w.close(1);

		$.sendEvent('se.lumens.events.SettingsChanged');
	};

}

/**
 * This should be called when the user has changed a preset.
 */
SavePanelOptions.prototype.changed = function()
{
	this.w.mainGroup.editPreset.buttonGroup.s.visible = false;
	this.w.mainGroup.editPreset.filename.s2.text      = this.getFilename();
}

SavePanelOptions.prototype.addPreset = function(preset)
{
	if (!preset)
		return;

	var list = this.w.mainGroup.savedPresets.list
	  , item = list.add('item', this.getListItemName(preset.name, preset.heading));

	this.presets[item.index] = preset;
}

SavePanelOptions.prototype.getListItemName = function(name, heading)
{
	return name + ' (' + heading + ')';
}

SavePanelOptions.prototype.redrawPreset = function(preset)
{
	if (!preset.name)
		return;

	var panel = this.w.mainGroup.editPreset;

	this.currentPreset            = preset;
	panel.index                   = this.w.mainGroup.savedPresets.list.selection.index;
	panel.g1.headingGroup.e.text  = preset.heading;
	panel.g1.nameGroup.e.text     = preset.name;
	panel.g2.pathGroup.e.text     = preset.path;
	panel.saveTypes.jpeg.value    = preset.outputFormats.jpg;
	panel.saveTypes.webjpeg.value = preset.outputFormats.webjpg;
	panel.saveTypes.png.value     = preset.outputFormats.png;
	panel.saveTypes.psd.value     = preset.outputFormats.psd;
	panel.quality.e.text          = preset.jpegQuality ? preset.jpegQuality : 10;
	panel.quality.slider.value    = parseInt(panel.quality.e.text);
	panel.quality.e.enabled       = preset.outputFormats.jpg || preset.outputFormats.webjpg;
	panel.quality.slider.enabled  = preset.outputFormats.jpg || preset.outputFormats.webjpg;
	panel.closeWhenSaved.c.value  = preset.close;
	panel.overwrite.c.value       = preset.overwrite;
	panel.filename.e.text         = preset.filename;

	if (SP_RESIZETOFIT == preset.action.type) {
		panel.action.dropdown.select(spActionToString(SP_RESIZETOFIT));
		panel.action.actionArgs.e1.text = preset.action.args[0];
		panel.action.actionArgs.e2.text = preset.action.args[1];
	} else if (SP_CUSTOMACTION == preset.action.type) {
		panel.action.dropdown.select(spActionToString(SP_CUSTOMACTION));
		panel.action.actionArgs.sets.select(preset.action.args[0]);
		panel.action.actionArgs.actions.select(preset.action.args[1]);
	} else {
		panel.action.dropdown.select(spActionToString(SP_NOACTION));
	}

	this.w.layout.layout(true);
}

SavePanelOptions.prototype.changeAction = function(e)
{
	var w          = this.parent.parent.parent.parent
	  , container  = w.mainGroup.editPreset.action
	  , actionArgs = null
	;

	container.parent.buttonGroup.s.visible = false;

	if (container.actionArgs) {
		container.remove(container.actionArgs);
		container.actionArgs = null;
	}

	if (this.selection.text == spActionToString(SP_RESIZETOFIT)) {
		actionArgs = container.add("Group { \
				preferredSize: [200,100], \
				s1: StaticText { text: 'Width' }, \
				e1: EditText { characters: 6 }, \
				s2: StaticText { text: 'Height' }, \
				e2: EditText { characters: 6 }, \
			}"
		);
	} else if (this.selection.text == spActionToString(SP_CUSTOMACTION)) {
		actionArgs = container.add("Group { \
				sets: DropDownList { preferredSize: [140, 20] }, \
				actions: DropDownList { preferredSize: [140, 20] }, \
			}"
		);

		// Populate action dropdowns.
		var actionSets = get_action_set_info();
		for (var i in actionSets)
			actionArgs.sets.add('item', actionSets[i].name);

		// Select first item in action set list.
		actionArgs.sets.selection = actionArgs.sets.items[0];

		// Update action dropdown when the action set has changed.
		actionArgs.sets.onChange = function()
		{
			w.mainGroup.editPreset.buttonGroup.s.visible = false;
			actionArgs.actions.removeAll();
			for (var i in actionSets[this.selection.index].children)
				actionArgs.actions.add('item', actionSets[this.selection.index].children[i].name);
		}
		actionArgs.actions.onChange = function() { w.mainGroup.editPreset.buttonGroup.s.visible = false; };
		actionArgs.sets.notify('onChange');
	}
	container.actionArgs = actionArgs;
	w.layout.layout(true);
}

SavePanelOptions.prototype.updatePreset = function()
{
	var list   = this.w.mainGroup.savedPresets.list
	  , preset = this.presetFromSettings()
	;

	if (!preset)
		return false;

	if (list.selection) {
		list.selection.text = this.getListItemName(preset.name, preset.heading);
		this.presets[list.selection.index] = preset;
	}

	sp.savePresets(this.presets);

	return true;
}

SavePanelOptions.prototype.removePreset = function(preset)
{
	var list = this.w.mainGroup.savedPresets.list
	  , i    = list.selection.index
	;

	if (null == list.selection)
		return;

	// Remove preset from ui.
	list.remove(list.selection);
	list.selection = list.items[i - 1];

	// Remove preset from data structure.
	this.presets.splice(i, 1);

	if (null != list.selection)
		this.currentPreset = this.presets[list.selection.index];

	// Update ui with blank preset.
	if (null == list.selection)
		this.redrawPreset(sp.preset());
}

SavePanelOptions.prototype.serializeInterface = function()
{
	var script = new File($.fileName)
	  , file   = new File(sp.presetsFolder.fullName + '/buttons.html')
	  , html    = ''
	  , grouped = []
	;

	for (var i in this.presets)
		if (this.presets[i].heading in grouped)
			grouped[this.presets[i].heading].push({ data: this.presets[i], index: i });
		else
			grouped[this.presets[i].heading] = [{ data: this.presets[i], index: i }];

	for (var key in grouped) {
		html += '<div class="subpanel expanded">\n';
		html += '<p>' + key + '</p>\n';
		html += '<div class="buttons">\n';
		for (var i in grouped[key]) {

			var preset = grouped[key][i]
			  , scriptLink = ''
			;

			if (13 > parseFloat(app.version))
				// CS5 => use script link.
				scriptLink = 'href="adobe://photoshop.cs5/Scripts/Save Panel Preset ' + preset.index + '" ';

			html  += '<span class="btn"><a class="save" ' + scriptLink + 'data-preset="\'' + Json.encode(preset.data).replace(/"/g, '&quot;') + '">';
			html  += preset.data.name.replace(/\s/g, '&nbsp;') + '</a></span>\n';
		}
		html += '</div>\n';
		html += '</div>\n';
	}

	if (file.open('w'))
		file.write(html);
}


function setupEventHelper()
{
	// Initialize PlugPlugExternalObject.
	var xLib;
	try {
		xLib = new ExternalObject("lib:\PlugPlugExternalObject");
	} catch(e) {
		alert('Missing ExternalObject: ' + e);
	}
	 
	// The function to use for sending events to html panels.
	$.sendEvent = function(type) {
		if (xLib) {
			var eventObj = new CSXSEvent();
			eventObj.type = type;
			eventObj.data = app.toString();
			eventObj.dispatch();
		}
	}
}

DropDownList.prototype.select = function(text)
{
	for (var i = 0; i < this.items.length; i++)
		if (this.items[i].text == text) {
			//this.selection = this.items[i];
			this.selection = i;
			break;
		}
}

sp_Preset = function()
{
	this.name          = '';
	this.path          = '';
	this.heading       = '';
	this.overwrite     = true;
	this.jpegQuality   = 12;
	this.outputFormats = {
		jpg: true,
		webjpg: false,
		png: false,
		psd: false,
	};
}

sp.preset = function() { return new sp_Preset(); }

var dialog = new SavePanelOptions();
