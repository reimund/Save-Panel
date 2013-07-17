/*
 * Name: Save Panel Options
 * Author: Reimund Trost (c) 2013
 * Email: reimund@lumens.se
 * Website: http://lumens.se/tools/savepanel/
 *
 * Description: Options dialog for the Save Panel script.
 */


//@include settings.js
//@include common.js
//@include constants.js
//@include actions.js
//@include PSSettings.js
//@include Json.js

//settings.clearSettings()
//settings.saveSettings();

// Use stored settings if they exist, defaults otherwise.

var SavePanelOptions = function(settings)
{
	var windowRes, w;

	windowRes = "dialog { \
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
				remov: Button { text: 'Remove' }, \
			}\
			editPreset: Panel { \
				preferredSize: [540, 20], \
				alignChildren: 'left', \
				text: 'Create / Edit preset', \
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
						e: EditText { characters: 40, }, \
						g: Group { \
							margins: [0, -6, 0 ,0], \
							preferredSize: [100, 5], \
							help: StaticText { text: 'Absolute or relative.' }, \
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
						text: 'Jpeg', \
					}, \
					webjpeg: Checkbox { \
						text: 'Jpeg (save for web)', \
					}, \
					png: Checkbox { \
						text: 'Png', \
					}, \
					psd: Checkbox { \
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
						margins: [365, 0, 0, 0], \
						g: Group { \
							orientation: 'row', \
							create: Button { text: 'New' }, \
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

	this.w        =  new Window(windowRes, 'Save Panel Options');
	this.presets  = [];
	this.settings = settings;
	
	this.setupUi();
	this.w.show();

}

SavePanelOptions.prototype.createPreset = function()
{
	var panel, preset

	panel  = this.w.mainGroup.editPreset;
	action = {
		type: SP_NOACTION,
		args: [],
	};

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

	if ('' == preset.heading
			|| '' == preset.name
			|| '' == preset.path) {
		alert('You must specify at least \'name\', \'heading\' and \'path\'');
		return false;
	}

	for (i in this.presets)
		if (this.presets[i].name == preset.name && i != panel.index) {
			alert('You must enter a unique name.');
			return false;
		}


	return preset;
}

SavePanelOptions.prototype.setupUi = function()
{
	var self, item, items, text, panel, listPanel, presets, smallFont, actions;

	self       = this;
	panel      = self.w.mainGroup.editPreset;
	listPanel  = self.w.mainGroup.savedPresets;
	presets    = self.settings.presets;
	smallFont  = ScriptUI.newFont(this.w.graphics.font.name, ScriptUI.FontStyle.REGULAR, 10);
	actions    = [SP_NOACTION, SP_RESIZETOFIT, SP_CUSTOMACTION];

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

	for (i in actions)
		self.w.mainGroup.editPreset.action.dropdown.add('item', spActionToString(actions[i]));

	for (i in presets)
		self.addPreset(presets[i]);

	// Set small font for help label.
	self.w.mainGroup.editPreset.g2.pathGroup.g.help.graphics.font 
		= self.w.mainGroup.editPreset.g1.nameGroup.g.help.graphics.font 
		= smallFont;

	panel.quality.slider.enabled    = panel.saveTypes.jpeg.value || panel.saveTypes.webjpeg.value;
	panel.quality.e.enabled         = panel.saveTypes.jpeg.value || panel.saveTypes.webjpeg.value;
	panel.action.dropdown.selection = panel.action.dropdown.items[0];

	self.setupEvents();

	listPanel.list.selection = 0;
	panel.filename.s2.text          = self.getFilename();

	this.w.layout.layout(true);
}

SavePanelOptions.prototype.getFilename = function()
{
	var self, types, regex, name, ext;

	if (documents.length < 1)
		return '';

	self  = this;
	types = self.w.mainGroup.editPreset.saveTypes;
	ext   = 'jpg';

	if (types.jpeg.value || types.webjpeg.value)
		ext = 'jpg';
	else if (types.psd.value)
		ext = 'psd';
	else if (types.png.value)
		ext = 'png';

	name  = sp.basename(activeDocument.name).substr(0, 254);
	regex = self.w.mainGroup.editPreset.filename.e.text;

	return regex.replace('$name', name) + '.' + ext;
}

SavePanelOptions.prototype.setupEvents = function()
{
	var self, editPreset;
	
	self       = this;
	panel      = self.w.mainGroup.editPreset;
	listPanel  = self.w.mainGroup.savedPresets;

	panel.action.dropdown.onChange          = self.changeAction;
	panel.g1.nameGroup.e.onChange           = function(e) { self.changed(); };
	panel.g1.headingGroup.e.onChange        = function(e) { self.changed(); };
	panel.g2.pathGroup.e.onChange           = function(e) { self.changed(); };
	panel.g2.browse.onClick                 = function(e) { self.changed(); panel.g2.pathGroup.e.text   = (f = Folder.selectDialog('Please select a directory.')) == null ? '' : f.fsName; };
	panel.closeWhenSaved.c.onClick          = function(e) { self.changed(); };
	panel.overwrite.c.onClick               = function(e) { self.changed(); };
	panel.filename.e.onChanging             = function(e) { self.changed(); };
	panel.saveTypes.psd.onClick             = function(e) { self.changed(); };
	panel.saveTypes.png.onClick             = function(e) { self.changed(); };
	panel.saveTypes.jpeg.onClick            = function(e) { self.changed(); panel.quality.e.enabled     = panel.quality.slider.enabled = this.value || panel.saveTypes.webjpeg.value; };
	panel.saveTypes.webjpeg.onClick         = function(e) { self.changed(); panel.quality.e.enabled     = panel.quality.slider.enabled = this.value || panel.saveTypes.jpeg.value; };
	panel.quality.slider.onChange           = function(e) { self.changed(); panel.quality.e.text        = Math.round(x.value); };
	panel.quality.slider.onChanging         = function(e) { self.changed(); panel.quality.e.text        = Math.round(this.value); };
	panel.quality.e.onChange                = function(e) { self.changed(); panel.quality.slider.value  = Math.round(Number(this.text)); };
	panel.buttonGroup.g.g.save.onClick      = function(e) { self.changed(); panel.buttonGroup.s.visible = self.updatePreset(); };
	panel.buttonGroup.g.g.create.onClick    = function(e) {
		self.changed();
		panel.index = listPanel.list.items.length;
		self.addPreset(self.createPreset());
	};

	listPanel.list.onChange                 = function(e) { self.changed(); self.redrawPreset(self.presets[listPanel.list.selection.index]); };
	listPanel.remov.onClick                 = function(e) { self.changed(); self.removePreset(self.currentPreset); };
	self.w.buttonGroup.cancelButton.onClick = function(e) { self.w.close(2); };

	self.w.buttonGroup.okButton.onClick     = function(e)
	{
		self.saveSettings();
		self.serializeInterface();
		self.w.close(1);
	};

}

/**
 * This should be called when the user has changed a preset.
 */
SavePanelOptions.prototype.changed = function()
{
	this.w.mainGroup.editPreset.buttonGroup.s.visible = false;
	this.w.mainGroup.editPreset.filename.s2.text      = this.getFilename();
	//this.w.layout.layout(true);
}

SavePanelOptions.prototype.addPreset = function(preset)
{
	var list, item;

	if (!preset)
		return;

	list = this.w.mainGroup.savedPresets.list;
	item = list.add('item', this.getListItemName(preset.name, preset.heading));

	this.presets[item.index] = preset;
}

SavePanelOptions.prototype.saveSettings = function()
{
	var self;

	self                  = this;
	self.settings.presets = self.presets;

	settings.addEntry('spSettings', self.settings);
	settings.saveSettings();
}

SavePanelOptions.prototype.getListItemName = function(name, heading)
{
	return name + ' (' + heading + ')';
}

SavePanelOptions.prototype.redrawPreset = function(preset)
{
	var self, panel;

	self                          = this;
	self.currentPreset            = preset;
	panel                         = self.w.mainGroup.editPreset;
	panel.index                   = self.w.mainGroup.savedPresets.list.selection.index;
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
	var w, container, actionArgs;

	w                                      = this.parent.parent.parent.parent;
	container                              = w.mainGroup.editPreset.action;
	actionArgs                             = null;
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
	}
	container.actionArgs = actionArgs;
	w.layout.layout(true);
}

SavePanelOptions.prototype.updatePreset = function()
{
	var self, list, preset;

	self   = this;
	list   = self.w.mainGroup.savedPresets.list;
	preset = self.createPreset();

	if (!preset)
		return false;

	if (list.selection) {
		list.selection.text = self.getListItemName(preset.name, preset.heading);
		self.presets[list.selection.index] = preset;
	}

	self.saveSettings();

	return true;
}

SavePanelOptions.prototype.removePreset = function(preset)
{
	var self, list, i;

	self = this;
	list = self.w.mainGroup.savedPresets.list;

	if (null == list.selection)
		return;

	// Remove preset from ui.
	i = list.selection.index;
	list.remove(list.selection);
	list.selection = list.items[i];

	// Remove preset from data structure.
	for (i in self.presets)
		if (preset.name == self.presets[i].name) {
			self.presets.splice(i, 1);
			break;
		}

	// Update ui with blank preset.
	if (null == list.selection)
		self.redrawPreset(sp.preset());
}

SavePanelOptions.prototype.serializeInterface = function()
{
	var script, file, preset, html, grouped;

	self    = this;
	script  = new File($.fileName);
	file    = new File(script.parent + '/buttons.html');
	html    = '';
	grouped = [];

	for (i in self.presets)
		if (self.presets[i].heading in grouped)
			grouped[self.presets[i].heading].push(self.presets[i]);
		else
			grouped[self.presets[i].heading] = [self.presets[i]];

	for (key in grouped) {
		html += '<p>' + key + '</p>\n';
		html += '<div class="buttons">\n';
		for (i in grouped[key]) {
			preset = grouped[key][i];
			html  += '<a class="btn save" data-preset="\'' + Json.encode(preset).replace(/"/g, '&quot;') + '">\n';
			html  += '<span>' + preset.name + '</span></a>\n';
		}
		html += '</div>\n';
	}

	if (file.open('w'))
		file.write(html);
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

var spSettings = spGetSettings();
var dialog = new SavePanelOptions(spSettings);
