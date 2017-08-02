// Ici on dessine la grille

$(document).ready(function(){

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


    var grid = $('div.grid');
    for(var i=1; i<=15; i++){
        grid.append('<div class="row"></div>');
    }

    var row = $('div.row');
    for(var j=1; j<=15; j++){
        row.append('<div class="box"></div>');
    }

    $(".box").on("click", function() {
        $(this).toggleClass(colorClass);
    });

});
