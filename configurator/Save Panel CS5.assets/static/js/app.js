jQuery(document).ready(function($) {


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

});
