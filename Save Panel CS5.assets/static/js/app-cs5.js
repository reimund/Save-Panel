jQuery(document).ready(function($) {
	update();

	$('span.btn a.options').on('click', function() {
		// Not sure why, but for some reason we get a 404 error if we call
		// the update function directly.
		// Also, adobe://-links seem to break if we add them later, but if we
		// reload the page they will start to work.
		setTimeout(function() { update(); location.reload(true); }, 100);
		
	});

});

function update()
{
	url = 'file:///' + getSettingsPath() + 'buttons.html'

	$.ajax({
		url: url,
		dataType: 'html',
		success: function(data, textStatus, xhr) {
			$('div.presets').empty().append(data);
		},
		error: function(xhr, textStatus, errorThrown ) {
			//console.log(xhr);
		},
	});

}

function getSettingsPath()
{
	var settingsPath = '';

	$.ajax({
		url: 'Save Panel Settings Path.txt',
		dataType: 'html',
		async: false,
		success: function(data, textStatus, xhr) {
			settingsPath = data;
		},
		error: function(xhr, textStatus, errorThrown ) {
		},
	});

	return settingsPath;
}
