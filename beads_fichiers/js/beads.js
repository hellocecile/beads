// Ici on dessine la grille

$(document).ready(function(){

    // Tableau de couleurs
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

    // Création de la grille
    var grid = $('div.grid');
    for(var i=1; i<=15; i++){
        grid.append('<div class="row"></div>');
    }

    var row = $('div.row');
    for(var j=1; j<=15; j++){
        row.append('<div class="box"></div>');
    }

    // Color picker
    var pickColor = $(".pick-color");

    $.each(colors, function(key, color){
        pickColor.append('<div class="pick" style="background-color:'+ color +'" data-color="'+ color +'"></div>');

        $(".pick").click(function(){
            color = $(this).attr("data-color");
        });

        $(".box").on("click", function() {
            $(this).css("background-color", color);
        });
    });


});
