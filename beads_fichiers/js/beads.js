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
        "white",
        "black",
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

        // Au clique sur une couleur
        $(".pick").click(function(){
            color = $(this).attr("data-color"); // On récupère la couleur
            $(this).addClass("selected"); // On met en évidence la couleur sélectionnée
            $(this).siblings().removeClass("selected");
        });

        var isDown = false;

        $(".box")
        .mousedown(function() {
            isDown = true;
        })
        .mousemove(function() {
            if(isDown){
                $(this).css("background-color", color);
            }
         })
        .click(function() {
            $(this).css("background-color", color);
        })
        .mouseup(function() {
            isDown = false;
        });

        $(".grid").mouseleave(function(){
            isDown = false;
        });

    });


});
