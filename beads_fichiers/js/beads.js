// Ici on dessine la grille

$(document).ready(function(){

    // tableau de couleurs
    var colors = [
        "cyan",
        "blue",
        "yellow",
        "orange",
        "red",
        "magenta",
        "pink",
        "green",
    ];

    var pickColor = $(".pick-color");

    $.each(colors, function(key, color){
        pickColor.append('<div class="pick"></div>');
        $(".pick").css("background-color", color);
    });

    // var color = '';
    //
	// $('.select-color').click(function() {
	// 	var selectedColor = $(this).attr('class');
    //
	// 	switch (selectedColor) {
	// 		case "select-color cyan not-selected":
	// 			color = 'cyan';
	// 			break;
	// 		case "select-color yellow not-selected":
	// 			color = 'yellow';
	// 			break;
	// 		case "select-color magenta not-selected":
	// 			color = 'magenta';
	// 			break;
	// 		case "select-color purple not-selected":
	// 			color = 'purple';
	// 			break;
	// 		case "select-color pink not-selected":
	// 			color = 'pink';
	// 			break;
	// 		case "select-color green not-selected":
	// 			color = 'green';
	// 			break;
	// 	}
    //
	// 	$(this).removeClass('not-selected');
	// 	$(this).siblings().addClass('not-selected');
	// });


    var grid = $('div.grid');
    for(var i=1; i<=15; i++){
        grid.append('<div class="row"></div>');
    }

    var row = $('div.row');
    for(var j=1; j<=15; j++){
        row.append('<div class="box"></div>');
    }

    $(".box").on("click", function() {
        $(this).css("background-color", color);
    });

});
