jQuery(document).ready(function($) {

	preload([
		'media/img/button-down.png',
		'media/img/button-hover.png',
	]);

	function preload(images)
	{
		$(images).each(function(){
			$('<img/>')[0].src = this;
		});
	}
});
