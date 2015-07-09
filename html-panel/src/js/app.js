try {
	var cs = new CSInterface()
	  , extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + '/'
	;
} catch (e) {
	console.log(e);
}

jQuery(document).ready(function($) {
	var debug = true;
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
		update();
	}

	$('.btn.options')
		.on('click', function() { evalFile(extensionRoot + 'js/photoshop/options.js'); });


	$('div.actions').on('click', 'div.subpanel p', function() {
		var p, c;
		p = $(this).parent();
		c = p.find('div.buttons');

		if (p.hasClass('expanded')) {
			c.hide();
			p.removeClass('expanded');
		} else {
			c.show();
			p.addClass('expanded');
		}
		if (typeof serializeUi == 'function')
			serializeUi();
	});

	var statusbar = $('.statusbar');
	statusbar.hide();
	
	$('div.actions').on('click', 'span.btn a.save', function() {
		var btn = this;

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

			var presetJsonStr = $(btn).data('preset').substr(1);

			call('save', [[presetJsonStr]], 'js/photoshop/interact.js', function(jsonResult) {
				var result = JSON.parse(jsonResult);

				statusbar.find('p').empty();
				fadeStatus(statusbar, result, 0, 1100 / result.length);
			});
		}
	});

	var cs = new CSInterface();

	cs.addEventListener('se.lumens.events.SettingsChanged', function(e) { update(); });
    cs.addEventListener('com.adobe.csxs.events.ThemeColorChanged', changeTheme); 
    
	changeTheme();
});

function update(callback)
{
	try {
		call('getSettingsPath', [], 'js/photoshop/interact.js', function(settingsRoot) {

			var url = 'file:///' + settingsRoot + 'buttons.html?' + Math.random().toString(36).substring(8);

			// Sync ui with saved presets.
			$.ajax({
				url: url,
				dataType: 'html',
				success: function(data, textStatus, xhr) {
					$('div.presets').empty().append(data);
					if (callback) callback();
				},
				error: function(xhr, textStatus, errorThrown ) {
					//alert(xhr.status);
				},
			});

			// Sync ui with saved settings (ie, expand and collapse subpanels).
			url = 'file:///' + settingsRoot + 'ui.json';

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
		});


	} catch (e) {
		alert(e);
	}
}

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
	
	call('serializeUi', [[collapsed]], 'js/photoshop/interact.js');
}

function call(fun, args, path, callback)
{
	var evalFile = '';

	if (path)
		evalFile = '$.evalFile(\'' + extensionRoot + path + '\'); ';

	cs.evalScript(evalFile + 'var jsonArgs = ' + JSON.stringify(args) + ';' + fun + '.apply(this, jsonArgs);', callback);
}

function runScript(scriptPath)
{
	var script = evalFileScript(scriptPath);
	setTimeout(function() { cs.evalScript(script) }, 100);

}

function evalFile(path)
{
	cs.evalScript('$.evalFile(\'' + path + '\');');
}

function evalFileScript(path)
{
	return 'var scriptFile = new File(app.path + \'/Presets/Scripts/' + path + '\');'
		+ '$.evalFile(scriptFile, 30000);';
}

function evalScript(path)
{
	cs.evalScript(evalFileScript(path));
}

/**
 * This function will be called when PP's theme color been changed.
 */
function changeTheme(event)
{
	var hostEnv = cs.getHostEnvironment();
	var bgColor = toHex(hostEnv.appSkinInfo.panelBackgroundColor);

	$('body').removeClass('darker');
	$('body').removeClass('dark');
	$('body').removeClass('light');
	$('body').removeClass('lighter');

	if ('#343434' == bgColor)
		$('body').addClass('darker');

	else if ('#535353' == bgColor)
		$('body').addClass('dark');

	else if ('#b8b8b8' == bgColor)
		$('body').addClass('light');

	else if ('#d6d6d6' == bgColor)
		$('body').addClass('lighter');
    
}

function toHex(color)
{
    var red      = Math.round(color.color.red);
    var green    = Math.round(color.color.green);
    var blue     = Math.round(color.color.blue);
    var alpha    = Math.round(color.color.alpha);

    return '#' + red.toString(16) + green.toString(16) + blue.toString(16);
}
