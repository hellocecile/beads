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
    var documentHeight = $( document ).height();
    var documentWidth = $( document ).width();
    // alert(documentWidth + " " + documentHeight);
    // une perle = 16px x 14px

    // nombre de rows = deviceHeight/14+2px de bordure
    var nbRows = documentHeight / 16;
    var grid = $('div.grid');
    for(var i=1; i<=nbRows; i++){
        grid.append('<div class="row"></div>');
    }

    var nbBeads = documentWidth / 18;
    var row = $('div.row');
    for(var j=1; j< (nbBeads-2); j++){
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

    // Bouton pour tout effacer
    $("button[name=clear-all]").click(function(){
        $(".box").css("background-color", "#FFF");
    });

    // TODO: Ajouter un bouton pour revenir en arrière
    $("button[name=undo]").click(function(){
        $(".box").undo(); // en cours
    });

    // TODO: Ajouter le "pot de peinture"

    // TODO: Enregistrer
    $("button[name=save]").click(function(){
         // en cours
    });

    // TODO: Faire capture d'écran / exporter
    $("button[name=export]").click(function(){
         // en cours
    });


    // TODO: Ajouter une popup au démarrage pour choisir l'orientation de la grille (peyote ou bickstitch)
    // Orientation peyote
    $("button[name=peyote]").click(function(){

        $("div.row").remove();

        alert(documentWidth + " " + documentHeight);

        var nbRowsP = documentHeight / 18;
        var gridP = $('div.grid');
        for(var i=1; i<=nbRowsP; i++){
            gridP.append('<div class="rowP"></div>');
        }

        var nbBeadsP = documentWidth / 16;
        var rowP = $('div.rowP');
        for(var j=1; j< (nbBeadsP-2); j++){
            rowP.append('<div class="boxP"></div>');
        }
    });

});
