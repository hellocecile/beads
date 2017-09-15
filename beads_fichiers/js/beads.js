$(document).ready(function(){


    //target the entire page, and listen for touch events
    // document.body.addEventListener('touchmove', function(event) {
    //   event.preventDefault();
    // }, false);

    var actions = [];
    var color;
    // Tableau de couleurs
    var colors = {
        "galvanized blush" : "#BB8E9A",
        "gold" : "#BD8B4D",
        "silver" : "#A7ABAC",

        "carnation" : "#E64C92",
        "dark salmon" : "#EA747C",
        "light peach" : "#E9B7A3",

        "light mint" : "#A4D2BD",
        "tea rose" : "#F0997D",
        "light lemon ice" : "#ECDC6D",

        "bisque white" : "#E5D8D9",
        "blush" : "#D7ACAE",
        "light terracotta" : "#CAAA9B",

        "red" : "#E71B3E",
        "mandarin" : "#F38423",
        "kelly green" : "#1F8F5D",

        "cobalt" : "#111F55",
        "turquoise" : "#0CA8D8",
        "turquoise green" : "#87D2D7",


        "light sky blue" : "#A7C1DC",
        "agathe blue" : "#9CADE5",
        "light violet" : "#D8C3E5",

        "brown beige" : "#A79695",
        "chocolate" : "#482F3F",
        "cognac" : "#5E4638",

        "beige" : "#EEE0C6",
        "white" : "#F5F9F9",
        "black" : "#000000",

        "ghost grey" : "#8F9EAF",
        "eraser" : "",


    };
	
	// Module beadGrid
	var beadGrid = (function(){
		var pattern = localStorage["pattern"] ? JSON.parse(localStorage["pattern"]) : '';
		// Détecter les tailles de device pour voir combien de cellules on met
		var documentHeight = $( document ).height();
		var documentWidth = $( document ).width();
		// nombre de rows = deviceHeight/14+2px de bordure
		var gridInfB = {nbRow:16, nbBead:18, classBox:'', classRow:'', colAngle:'to right'};
		var gridInfP = {nbRow:18, nbBead:16, classBox:'boxP', classRow:'rowP', colAngle:'to bottom'};
		var beadDir = 'brickstitch';
		var gridInf = beadDir == 'peyote' ? gridInfP : gridInfB;	
        var nbRows = documentHeight / gridInf.nbRow;
		var nbBeads = documentWidth / gridInf.nbBead;
		var beadCell = '<div class="box "></div>';
		var $beadRow = $('<div class="row "></div>');
		
		//cache DOM
		var $grid = $('div.grid');
		var $btnSave = $('button[name=save]');
		var $btnClear = $("button[name=clear-all]");
		 
		//initialisation
		function _init(){
			if(pattern){ // Si on a déjà qqch d'enregistré en localStorage
				restoreGrid(pattern);
			} else {
				createGrid();
			}
					
			bindEvt();
		}
		
		//bind events
		function bindEvt(){
			// Au clique sur enregistrer
			$btnSave.click(function(){
				beadGrid.saveGrid($(this));
			});
			// Bouton pour tout effacer
			$btnClear.click(function(){
				clearGrid();
			});			
			// Bouton pour orientation perle
			$("button[name=bead-orientation]").click(function(){
				$(this).html(beadDirChange($(this).html().toLowerCase()));
			});
		}
		
		// Création d'une ligne
		function createRow(){
			for(var j=1; j< (nbBeads-2); j++){
				$beadRow.append(beadCell);
			}
		}
		
		// Création de la grille
        // une perle = 16px x 14px
		function createGrid(){
			createRow();
			for(var i=1; i<=nbRows; i++){
				$grid.append($beadRow.clone());				
			}
		}
		
		// Réstauration d'un schéma enregistré
		function restoreGrid(pattern){	
			$grid.append(pattern);
			// MAJ du texte du bouton de direction grille si grille peyote
			if($(".grid").find(".box.boxP").length !== 0){
				beadDir = 'peyote';
				$(".grid").attr("data-gridDir",'peyote');
				$("button[name=bead-orientation]").html('brickstitch');
			}
		}
		
		// Enregistrer notre motif en cours
		function _saveGrid($btn){
			pattern = $grid.html();
			localStorage["pattern"] = JSON.stringify(pattern);
			// message de confirmation
			$btn.notify("Enregistré", { elementPosition:"right middle", className: "success" });
		}
		
		// Coloration d'une perle
		function _colorBead(bead){
		  actions.push(bead);
		  if(color){
			  //$(bead).css("background-color", color);
			  $(bead).css("background", "-moz-linear-gradient("+gridInf.colAngle+", "+ color +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ color +" 99%), "+ color +"");
			  $(bead).css("background", "-webkit-linear-gradient("+gridInf.colAngle+", "+ color +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ color +" 99%), "+ color +"");
			  $(bead).css("background", "linear-gradient("+gridInf.colAngle+", "+ color +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ color +" 99%), "+ color +"");
			  $(bead).attr('data-color', color);
		  }else{
			  unColorBead($(bead));
		  }

		  localStorage["actions"] = JSON.stringify(actions);
		}
		
		// Décoloration d'une perle
		function unColorBead(bead){
		  actions.push(bead);
		  $(bead).removeAttr('style data-color');
		  localStorage["actions"] = JSON.stringify(actions);
		}
		
		// RAZ grille
		function clearGrid(){
			unColorBead($grid.children().children());
		}
		
		// Changement orientation perles
		function beadDirChange(newDir){
			// Sauvegarde perle direction origine pour MAJ texte bouton changement
			var dirOri = beadDir;
			// MAJ perle direction avec nouvelle direction
			beadDir = newDir;
			// MAJ des infos sur la grille
			gridInf = beadDir == 'peyote' ? gridInfP : gridInfB;
			// Si nouvelle direction est peyote, ajout des class associées, sinon suppressions des class peyote
			if(beadDir == 'peyote'){
				$(".box").addClass(gridInfP.classBox);
				$(".row").addClass(gridInfP.classRow);
				$(".grid").attr('data-gridDir', 'peyote');
			}else{
				$(".box").removeClass(gridInfP.classBox);
				$(".row").removeClass(gridInfP.classRow);				
				$(".grid").removeAttr('data-gridDir');
			}
			// MAJ orientation couleur perles
			colorTmp = color; // Mémorisation de la couleur selectionnée dans pickColor
			$(".box[data-color]").each(function(){
				color = $(this).attr('data-color');
				_colorBead($(this));
			});
			// Restoration de la variable couleur de coloriage
			color = colorTmp;
			// Retourne l'orientation d'origine pour modification du texte du bouton d'orientation
			return(dirOri);
		}
		
		return {
			init: _init,
			saveGrid: _saveGrid,
			colorBead: _colorBead
		}
		
	})()


    // Module colorPicker
	var colorPicker = (function(){
		
		//cache DOM
		var $pickColor = $(".pick-color");
		var $colorIcon;
		
		//initialisation
		function _init(){
			createWindow(colors);
			bindEvt();
		}
		//bind events
		function bindEvt(){
			// Au clique sur une couleur
			$colorIcon.click(function(){
				colorPicker.setColor($(this));
			});
		}
		
		// Création de la fenêtre colorPicker
		function createWindow(colors){
			$.each(colors, function(key, color){
				var html = '<div class="pick" style="background-color:'+ color +'" data-color="'+ color +'"><i class="fa ';
				html += (key == "eraser") ? 'fa-eraser' : ''; // mise en forme bouton gomme
				html += '" aria-hidden="true"></i></div>';
				$pickColor.append(html);
			});
			
			$colorIcon = $pickColor.find(".pick");		
		}
		
		//Définition de la couleur
		function _setColor(colorElm){
			color = colorElm.attr("data-color"); // On récupère la couleur
			selectedColor(colorElm); // On met en évidence la couleur sélectionnée
		}
		
		//Mise en évidence de la couleur sélectionnée
		function selectedColor(colorElm){
			colorElm.addClass("selected"); // On met en évidence la couleur sélectionnée
			colorElm.siblings().removeClass("selected");
		}
				
		return {
			init: _init,
			setColor: _setColor
		}
	})();
    

	beadGrid.init();
	colorPicker.init();
	
    $.each(colors, function(key, color){
        // Version mobile
        // TODO: event touch
        // $('.box').on({
        //     'touchstart' : function(){
        //         // instructions
        //         isDown = true;
        //     },
        //     'touchmove' : function(){
        //         if(isDown){
        //             $(this).css("background-color", color);
        //         }
        //     },
        //     'touchend' : function(){
        //         isDown = false;
        //     }
        //  });

        // test mobile 2
        // $(".box").on("touchstart tap", function() {
        //     isDown = true;
        // });
        //
        // $(".box").on("swipe", function() {
        //     $.event.special.swipe.horizontalDistanceThreshold = 10;
        //     //if(isDown){
        //         $(this).css("background-color", color);
        //     //}
        // });
        //
        // $(".box").on("touchend", function() {
        //     isDown = false;
        // });

    });


    

    var isDown = false;

    // Version desktop
    $(".box")
    .mousedown(function() {
        isDown = true;
    })
    .mousemove(function() {
        if(isDown){
         beadGrid.colorBead($(this));
        }
     })
     .click(function() {
         beadGrid.colorBead($(this));
    })
    .mouseup(function() {
        isDown = false;
    });

    $(".grid").mouseleave(function(){
        isDown = false;
    });

    


    // TODO: ajouter bouton gomme (removeClass...)

    

    // TODO: Ajouter un bouton pour revenir en arrière
    $("button[name=undo]").click(function(){
        // $(".box").undo(); // en cours
    });

    // TODO: Ajouter le "pot de peinture"

    

    // TODO: Faire capture d'écran / exporter
    $("button[name=export]").click(function(){
         // en cours
    });


    // TODO: Ajouter une popup au démarrage pour choisir l'orientation de la grille (peyote ou brickstittch)
    // Orientation peyote
    // $("button[name=choose]").click(function(){
     // $("button[name=grid-peyote]").click(function(){

         // $("div.row").remove();

        // // alert(documentWidth + " " + documentHeight);
        // var nbRowsP = documentHeight / 18;
        // var gridP = $('div.grid');
        // for(var i=1; i<=nbRowsP; i++){
            // gridP.append('<div class="rowP"></div>');
        // }

        // var nbBeadsP = documentWidth / 16;
        // var rowP = $('div.rowP');
        // for(var j=1; j< (nbBeadsP-2); j++){
            // rowP.append('<div class="boxP"></div>');
        // }
    // });

});