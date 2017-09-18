$(document).ready(function(){


    //target the entire page, and listen for touch events
    // document.body.addEventListener('touchmove', function(event) {
    //   event.preventDefault();
    // }, false);

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
	
	// subpub (publish subscribe)
	var subpub = {
	  events: {},
	  on: function (eventName, fn) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	  },
	  off: function(eventName, fn) {
		if (this.events[eventName]) {
		  for (var i = 0; i < this.events[eventName].length; i++) {
			if (this.events[eventName][i] === fn) {
			  this.events[eventName].splice(i, 1);
			  break;
			}
		  };
		}
	  },
	  emit: function (eventName, data) {
		if (this.events[eventName]) {
		  this.events[eventName].forEach(function(fn) {
			var args = [];
			if($.type(data) === 'object'){
				args = $.map(data, function(value, index) {
					return [value];
				});
			}else{
				args.push(data);
			}
			fn.apply(this, args);
		  });
		}
	  }
	};
	
	// Module beadTools
	var beadTools = (function(){
		//cache DOM
		var $btnSave = $('button[name=save]');
		var $btnClear = $("button[name=clear-all]");
		var $btnUndo = $("button[name=undo]");
		var $btnGridOrient = $("button[name=bead-orientation]");
		
		//bind events		
		subpub.on("undoAction", undoAction);
		subpub.on("gridOrient", setBtnOrient);
		// Au clique sur enregistrer
		$btnSave.click(function(){
			subpub.emit("saveGrid", $(this));
		});
		// Bouton pour tout effacer
		$btnClear.click(function(){	
			subpub.emit("clearGrid", );
		});		
		// Bouton undo
		$btnUndo.click(function(){
			subpub.emit("undoAction", );
		});		
		// Bouton pour orientation perle
		$btnGridOrient.click(function(){
			var newDir = $btnGridOrient.attr("data-newGridDir");
			var prevDir = newDir == 'peyote' ? 'brickstitch' : 'peyote';
			subpub.emit("gridOrient", newDir);
			subpub.emit("toUndoList", {action:'gridOrient', params: {prevDir: prevDir, dir: newDir} });			
		});
		
		function setBtnOrient(newDir){
			var nextDir = newDir == "peyote" ? "brickstitch" : "peyote";
			$btnGridOrient.attr("data-newGridDir", nextDir);
			$btnGridOrient.html(nextDir);
		}
		
		// Fonction retour arrière (undo)
		function undoAction(){
			var undoList = localStorage["undoList"] ? JSON.parse(localStorage["undoList"]) : [];
			var lastAction = ($(undoList).get(-1));
			console.log(lastAction.action);
			console.log(lastAction.action, $.type(lastAction.action));
			console.log(lastAction.params);
			subpub.emit(lastAction.action, lastAction.params);
			//subpub.emit("colorClic", "#000");
			console.log(color);
			undoList.pop();
			//console.log(undoList);
			localStorage["undoList"] = JSON.stringify(undoList);
		}
		
	})();
	
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
		
		//bind events
		subpub.on("gridOrient", beadDirChange);
		subpub.on("clickBead", colorBead);
		subpub.on("colorBead", colorBead);
		subpub.on("saveGrid", saveGrid);
		subpub.on("clearGrid", clearGrid);
		 
		//initialisation
		(function init(){
			if(pattern){ // Si on a déjà qqch d'enregistré en localStorage
				restoreGrid(pattern);
			} else {
				createGrid();
			}
		})();
		
		
		
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
				subpub.emit("gridOrient", {orient: 'peyote'});
			}
		}
		
		// Enregistrer notre motif en cours
		function saveGrid($btn){
			pattern = $grid.html();
			localStorage["pattern"] = JSON.stringify(pattern);
			// message de confirmation
			$btn.notify("Enregistré", { elementPosition:"right middle", className: "success" });
		}
		
		// Coloration d'une perle
		function colorBead(bead, colorB = color){
			 // console.log('color', bead, colorB);
		  if(colorB){
			  //$(bead).css("background-color", color);
			  $(bead).css("background", "-moz-linear-gradient("+gridInf.colAngle+", "+ colorB +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ colorB +" 99%), "+ colorB +"");
			  $(bead).css("background", "-webkit-linear-gradient("+gridInf.colAngle+", "+ colorB +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ colorB +" 99%), "+ colorB +"");
			  $(bead).css("background", "linear-gradient("+gridInf.colAngle+", "+ colorB +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ colorB +" 99%), "+ colorB +"");
			  $(bead).attr('data-color', colorB);
		  }else{
			  unColorBead($(bead));
		  }
		}
		
		// Décoloration d'une perle
		function unColorBead(bead){
		  $(bead).removeAttr('style data-color');
		}
		
		// RAZ grille
		function clearGrid(){
			unColorBead($grid.children().children());
		}
		
		// Changement orientation perles
		function beadDirChange(newDir){
			// Execution que si nouvelle direction différent de la direction de la grille actuelle
			if($(".grid").attr('data-gridDir') != newDir){
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
				//colorBead($(this));
				subpub.emit("clickBead", $(this));
			});
			// Restoration de la variable couleur de coloriage
			color = colorTmp;
			}
		}
		
		//Gestion des événements sourie/touch
		var isDown = false;
		var $bead;
		
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) { 
			// Version mobile
			$(".box")
			.on("vmousedown", function(){
				touchClickBead();
			})
			.on("vmousemove", function(){
				touchClickBead();
			});
			function touchClickBead(){
				//Récupère l'élement ou se trouve le doigt
				var $target = $(document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY));
				//Si l'élément est une perle, execution du coloriage
				if($target.hasClass("box")) clickBead($target);
			}		
		}else{
			// Version desktop
			$(".box")
			.mousedown(function() {	
				isDown = true;
				clickBead($(this));
			})
			.mousemove(function() {
				if(isDown && event.target != $bead){
					clickBead($(this));
				}
			 })
			.mouseup(function() {	
				isDown = false;
			});

			$(".grid").mouseleave(function(){
				isDown = false;
			});
		}		
		
		function clickBead(target){
			$bead = target ? target : event.target;		
			var prevColor = $bead.attr("data-color") || '';
			if(prevColor != color){
				subpub.emit("clickBead", $bead);
				subpub.emit("toUndoList", {action:'colorBead', params:{$bead , prevColor, color} });				
			}
		}
		
	})();


    // Module colorPicker
	var colorPicker = (function(){
		
		//cache DOM
		var $pickColor = $(".pick-color");
		var $colorIcon;
		
		//initialisation
		(function init(){
			createWindow(colors);
		})();
		
		//bind events
		// Au clique sur une couleur
		$colorIcon.click(function(){
			//var $clickArea = $(this);
			var clickArea = event.target;
			// console.log(clickArea);
			var prevColor = color ? color : '';
			color = $(clickArea).attr("data-color"); // On récupère la couleur
			subpub.emit("colorClic", {clickArea: clickArea, color:color});
			subpub.emit("toUndoList", {action:'colorClic', params: {clickArea: $(clickArea), color: prevColor, NewColor: color} });
		});
		subpub.on("colorClic", colorClic); // On met en évidence la couleur sélectionnée et config couleur
		
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
		
		//Actions au clic sur une couleur
		function colorClic(clickArea, newColor){
			setColor(newColor);
			selectedColor(clickArea);
		}
		
		//Définition de la couleur
		function setColor(newColor){
			color = newColor;
		}
		
		//Mise en évidence de la couleur sélectionnée
		function selectedColor(clickArea){
			$(clickArea).addClass("selected"); // On met en évidence la couleur sélectionnée
			$(clickArea).siblings().removeClass("selected");
		}

	})();

	// Module logger
	var logger = (function(){
		//bind events
		subpub.on("toUndoList", undoList);
		
		//Mise en liste undo
		function undoList(data){
			var undoList = localStorage["undoList"] ? JSON.parse(localStorage["undoList"]) : [];
			undoList.push(data);
			localStorage["undoList"] = JSON.stringify(undoList);
		}
	})();
		

    // TODO: Ajouter un bouton pour revenir en arrière
    $("button[name=undo]").click(function(){
        // $(".box").undo(); // en cours
    });

    // TODO: Ajouter le "pot de peinture"
   

    // TODO: Faire capture d'écran / exporter
    $("button[name=export]").click(function(){
         // en cours
    });


    // TODO: Ajouter une popup au démarrage pour choisir l'orientation de la grille (peyote ou brickstitch)

});

