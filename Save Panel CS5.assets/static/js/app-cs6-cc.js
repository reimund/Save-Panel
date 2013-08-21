jQuery(document).ready(function($) {
	waitFor_Adobe(update, 3000);

	$('span.btn a.options').on('click', function() {
		var script;
		try {
			script = _Adobe.assetsPath + '/static/js/ps/options.js';
			_Adobe.invokeScriptFile(script);
			update();
		} catch (e) {
			alert(e);
		}
	});

	$('div.actions').on('click', 'span.btn a.save', function() {
		var presetJsonStr, script;
		
		presetJsonStr = $(this).data('preset').substr(1);
		script        = _Adobe.assetsPath + '/static/js/ps/functions.js';

		_Adobe.invokeFunctionInScriptFile(script, 'se_lumens_savepanel', 'save', [presetJsonStr]);
	});

	var debounced_resize = sp.debounce(function() {
		var script = _Adobe.assetsPath + '/static/js/ps/functions.js';
		_Adobe.invokeFunctionInScriptFile(
			script,
			'se_lumens_savepanel',
			'updatePanelSize',
			[$(window).width(), $(window).height()]
		);
	}, 200);

	$(window).resize(function() {
		debounced_resize();
	});

});

function update() {
	try {
		_Adobe.includeJSXFile('static/js/ps/interact.js');
		url = _Adobe.JSXInterface.call('getSettingsPath') + 'buttons.html';
	} catch (e) {
		alert(e);
	}

	$.ajax({
		url: url,
		dataType: 'html',
		success: function(data, textStatus, xhr) {
			$('div.presets').empty().append(data);
		},
		error: function(xhr, textStatus, errorThrown ) {
			console.log(textStatus);
		},
	});

}

function waitFor_Adobe(fun, timeout)
{
	var startTime, intervalId;

	startTime  = new Date().getTime();
	intervalId = setInterval(function() {
		try {
			var test = _Adobe;
			clearInterval(intervalId);
			fun();
			return;
		} catch (e) { }

		if ((new Date().getTime()) > startTime + timeout) {
			clearInterval(intervalId);
			console.log('Could not init _Adobe object.');
		}

	}, 150);
	
}

sp = {};
sp.debounce = function(fn, timeout) 
{
	var timeoutID = -1;
	return function() {
		if (timeoutID > -1) {
			window.clearTimeout(timeoutID);
		}
		timeoutID = window.setTimeout(fn, timeout);
	}
};

// Define event handler.
function onThemeChanged(e)
{
	var bgColor = e.appSkinInfo.panelBackgroundColor;

	if ("d6d6d6" == bgColor)
		setTheme('light');

	else if ("b8b8b8" == bgColor)
		setTheme('light');
		//setTheme('medium');

	else if ("535353" == bgColor)
		setTheme('dark');

	else if ("343434" == bgColor)
		setTheme('dark');
		//setTheme('darker');
}

function setTheme(theme)
{
	$('head link').remove();
	addStylesheet('static/css/master.css')
	addStylesheet('static/css/' + theme + '.css')
}

function addStylesheet(url)
{
	$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
}
