// Ici on dessine la grille

$(document).ready(function(){

    var rows = [];
    for(var i = 1; i <= 15; i++){
        rows.push('<div class="row"></div>');
    }

    var boxes = [];
    for(var i = 1; i <= 15; i++){
        boxes.push('<div class="box"></div>');
    }

    $('div.grid').append(rows.join(""));
    $('div.row').append(boxes.join(""));

});
