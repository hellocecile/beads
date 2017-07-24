$(document).ready(function() {

	var colorClass = '';

	$('.select-color').click(function() {
		var selectedColor = $(this).attr('class');

		switch (selectedColor) {
			case "select-color cyan not-selected":
				colorClass = 'cyan';
				break;
			case "select-color yellow not-selected":
				colorClass = 'yellow';
				break;
			case "select-color magenta not-selected":
				colorClass = 'magenta';
				break;
			case "select-color purple not-selected":
				colorClass = 'purple';
				break;
			case "select-color pink not-selected":
				colorClass = 'pink';
				break;
			case "select-color green not-selected":
				colorClass = 'green';
				break;
		}

		$(this).removeClass('not-selected');
		$(this).siblings().addClass('not-selected');
	});

// au clique sur une div
	$('.box').click(function() {
		$(this).toggleClass(colorClass);
	});

});
