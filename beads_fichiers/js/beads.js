$(document).ready(function(){

    // Tableau de couleurs
    // TODO: Faire des palettes de couleurs personnalisées.
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
    // TODO: Détecter les tailles de device pour voir combien de cellules on met

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

        // Version desktop
        $(".box")
        .mousedown(function() {
            isDown = true;
        })
        .mousemove(function() {
            if(isDown){
                $(this).css("background-color", color);
            }
         })
        .mouseup(function() {
            isDown = false;
        });

        $(".grid").mouseleave(function(){
            isDown = false;
        });

        $(".box").on("click", function() {
            $(this).css("background-color", color);
        })

        // Version mobile
        // TODO: event touch

    });

    // TODO: Ajouter un bouton pour tout effacer
    // TODO: Ajouter un bouton pour revenir en arrière

    // TODO: Ajouter le "pot de peinture"

    // TODO: Enregistrer

    // TODO: Faire capture d'écran / exporter


});
