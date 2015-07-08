jQuery(document).ready(function($) {
	debug = true;
	debug = false;

	if (debug) {
		$('div.presets').html('<div class="subpanel expanded"> \
					<p>Save Jpeg</p> \
					<div class="buttons"> \
						<span class="btn"><a class="save">820</a></span> \
						<span class="btn"><a class="save">820_bw</a></span> \
						<span class="btn"><a class="save">920</a></span> \
						<span class="btn"><a class="save">920_bw</a></span> \
						<span class="btn"><a class="save">Full</a></span> \
						<span class="btn"><a class="save">Full_bw</a></span> \
					</div> \
				</div> \
				<div class="subpanel expanded"> \
					<p>Save Psd</p> \
					<div class="buttons"> \
						<span class="btn"><a class="save">Psd</a></span> \
					</div> \
				</div>');
	} else {
		waitFor_Adobe(update, 3000);
	}


	var statusbar = $('.statusbar');
	statusbar.hide();
	
	$('span.btn a.options').on('click', function() {
		var script;
		try {
			script = _Adobe.assetsPath.replace(/file:\/\/\/?/, '') + '/static/js/ps/options.js';
			_Adobe.invokeScriptFile(script);
			location.reload(true);
		} catch (e) {
			//alert(e);
			console.log(e);
		}
	});

	$('div.actions').on('click', 'span.btn a.save', function() {
		var presetJsonStr, fileSaved;

		statusbar.find('div').html('<p>Saving...</p>');
		statusbar.clearQueue().stop().fadeIn('fast');
	
		if (debug) {
			result = [
				{ success: true, message: 'strings are strings' },
				{ success: true, message: 'yourself is not a string' },
			];
			//result = [
				//{ success: false, message: 'Nothing to save.' },
			//];
		} else {
			presetJsonStr = $(this).data('preset').substr(1);
			result        = _Adobe.JSXInterface.call('save', [presetJsonStr]);
		}
		statusbar.find('p').empty();
		fadeStatus(statusbar, result, 0, 1100 / result.length);
	});

	function fadeStatus(statusbar, statuses, i, duration)
	{
		var p;

		if (statuses[i].success) {
			statusbar.find('div').html('<p class="success"><span class="icon">Saved</span> <span class="file">' + statuses[i].message + '</span></p>');
		} else {
			statusbar.find('div').html('<p class="error">' + statuses[i].message + '</p>');
		}

		p = statusbar.find('div p');

		// Truncate with ellipsis (...) in the middle.
		statusbar.find('span.file').text(chop(statuses[i].message, getMaxFileLength()));

		// Fade in status texts.
		p.hide();
		p.fadeIn(duration, function() {
			if (statuses.length > (i + 1))
				fadeStatus(statusbar, statuses, Math.min(i + 1, statuses.length - 1), duration);
			else
				statusbar.delay(2200).fadeOut(duration);
		});
	}

	function chop(str, max)
	{
		if (str.length <= max)
			return str;

		var keepLength = ((max - 3) / 2);
		return $.trim(str.substr(0, Math.floor(keepLength))) + '...' + $.trim(str.substr(str.length - Math.ceil(keepLength)));
	}

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
	var settingsPath, url;
	try {
		_Adobe.includeJSXFile('static/js/ps/interact.js');

		settingsPath = _Adobe.JSXInterface.call('getSettingsPath');
		url          = 'file:///' + settingsPath + 'buttons.html';

		// Sync ui with saved presets.
		$.ajax({
			url: url,
			dataType: 'html',
			success: function(data, textStatus, xhr) {
				$('div.presets').empty().append(data);
			},
			error: function(xhr, textStatus, errorThrown ) {
				//alert(xhr.status);
			},
		});

		// Sync ui with saved settings.
		url = 'file:///' + settingsPath + 'ui.json';

		$.ajax({
			url: url,
			dataType: 'html',
			success: function(data, textStatus, xhr) {
				var collapsed = JSON.parse(data).collapsed;
				for (i in collapsed) {
					$('div.subpanel p').each(function() {
						if ($(this).text() == collapsed[i]) {
							$(this).parent().removeClass('expanded');
							$(this).parent().find('div.buttons').hide();
						}
					});
				}
			},
			error: function(xhr, textStatus, errorThrown ) {
				//alert(xhr.status);
			},
		});
	} catch (e) {
		alert(e);
	}


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

sp          = {};
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
		setTheme('medium');

	else if ("535353" == bgColor)
		setTheme('dark');

	else if ("343434" == bgColor)
		setTheme('darker');
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

function lettersThatFit(text, targetWidth)
{
	var dummy = $('.letter-test div');
	dummy.empty();
	for (var i = 0; i < text.length; i++) {
		currentChar = text.charAt(i).replace(' ', '\xA0');
		dummy.text(dummy.text() + currentChar);

		if (dummy.get(0).clientWidth > targetWidth)
			return i;
	}
	return text.length;
}

function getMaxFileLength()
{
	var targetWidth = $('p.success').width() - $('span.icon').width();
	return lettersThatFit($('span.file').text(), targetWidth);
}

function serializeUi()
{
	var collapsed = [];
	
	$('div.subpanel p').each(function() {
		if (!$(this).parent().hasClass('expanded'))
			collapsed.push($(this).text());
	});
	
	_Adobe.JSXInterface.call('serializeUi', [collapsed]);
}
