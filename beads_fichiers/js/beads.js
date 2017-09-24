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
			//Si data est un objet et pas un élément DOM, transformation en tableau
			if($.type(data) === 'object' && !data.nodeType && (!data.action || !data.params)){
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
	
	
    // Module colorPicker
	var colorPicker = (function(){
		
		//cache DOM
		var $pickColor = $(".pick-color");
		var $colorIcons;
		
		//initialisation
		(function init(){
			createWindow(colors);
		})();
		
		//bind events
		// Au clique sur une couleur
		$colorIcons.click(function(){
			var $clickArea = $(this);
			var prevColor = color ? color : '';
			color = $clickArea.attr("data-color"); // On récupère la couleur
			subpub.emit("colorClic", {clickArea: $clickArea, color:color});
			subpub.emit("toUndoList", {action:'colorClic', params: {clickArea: $clickArea, color: prevColor, NewColor: color} });
		});
		subpub.on("colorClic", colorClic); // On met en évidence la couleur sélectionnée et config couleur
		subpub.on("colorCount", colorNumber);
		
		// Création de la fenêtre colorPicker
		function createWindow(colors){
			$.each(colors, function(key, color){
				var html = '<div class="pick" style="background-color:'+ color +'" data-color="'+ color +'"><i class="fa ';
				html += (key == "eraser") ? 'fa-eraser' : ''; // mise en forme bouton gomme
				html += '" aria-hidden="true"></i></div>';
				$pickColor.append(html);
			});
			
			$colorIcons = $pickColor.find(".pick");
		}
		
		// Affichage du nombre par couleur
		function colorNumber(color, value){
			var $colorNbLabel = colorNbLabel(color);
			var nb = parseInt($colorNbLabel.html()) || 0;
			nb += value;
			nb <= 0 ? RemoveNbColorLabel($colorNbLabel) : $colorNbLabel.text(nb);
		}
		
		// Puce nombre couleur
		function colorNbLabel(color){
			var $colorIcon = $colorIcons.filter("[data-color='"+color+"']");
			var $colorNbLabel = $colorIcon.find('[data-nbcolor]');
			if($colorNbLabel.length <= 0){
				var html = '<span class="badge" data-nbcolor></span>';
				$colorIcon.append(html);
				$colorNbLabel = $colorIcon.find('[data-nbcolor]');
			}			
			return $colorNbLabel;
		}
		
		// Supprime puce nombre couleur
		function RemoveNbColorLabel($colorNbLabel){
			$colorNbLabel.remove();
			return true;
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

	
	// Module beadTools
	var beadTools = (function(){
		
		var colorsCount = [];
		//cache DOM
		var $btnSave = $('button[name=save]');
		var $btnClear = $("button[name=clear-all]");
		var $btnUndo = $("button[name=undo]");
		var $btnGridOrient = $("button[name=bead-orientation]");
		
		//bind events
		subpub.on("gridOrient", setBtnOrient);
		subpub.on("colorCount", colorCount);
		// Au clique sur enregistrer
		$btnSave.click(function(){
			subpub.emit("saveGrid", this);
		});
		// Bouton pour tout effacer
		$btnClear.click(function(){	
			subpub.emit("clearGrid");
		});		
		// Bouton undo
		$btnUndo.click(function(){
			subpub.emit("undoAction");
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
		
		// Comptage couleur
		function colorCount(color, value){
			// incrémente de value le nombre de la couleur
			colorsCount[color] = colorsCount[color] + value || value;
			// supprime la couleur du tableau si null ou négatif
			if(colorsCount[color] <= 0) delete colorsCount[color];
		}
		
	})();
	
	// Module beadGrid
	var beadGrid = (function(){
		var pattern = localStorage["pattern"] ? JSON.parse(localStorage["pattern"]) : '';
		// Détecter les tailles de device pour voir combien de cellules on met
		var documentHeight;
		var documentWidth;
		var windowHeight;
		var windowWidth;
		// nombre de rows = deviceHeight/14+2px de bordure
		var gridInfB = {nbRow:16, nbBead:18, classBox:'', classRow:'', colAngle:'to right'};
		var gridInfP = {nbRow:18, nbBead:16, classBox:'boxP', classRow:'rowP', colAngle:'to bottom'};
		var beadDir = 'brickstitch';
		var gridInfs = setgridInfs(beadDir);
        var nbRows;
		var nbBeads;
		var beadCell = '<div class="box "></div>';
		var $beadRow = $('<div class="row "></div>');
		
		//cache DOM
		var $grid = $('div.grid');
		
		//bind events
		subpub.on("gridOrient", setgridInfs);
		subpub.on("gridOrient", beadDirChange);
		subpub.on("clickBead", colorBead);
		subpub.on("colorBead", colorBead);
		subpub.on("saveGrid", saveGrid);
		subpub.on("clearGrid", clearGrid);
		subpub.on("colorCountRAZ", colorCountRAZ);
		
		// Config gridInfs
		function setgridInfs(beadDir){
			gridInfs = beadDir == 'peyote' ? gridInfP : gridInfB;
			return gridInfs;
		}
		 
		// Détails de grille
		function gridDetails(){
			// Détecter les tailles de device pour voir combien de cellules on met
			// documentHeight = $( document ).height() - 50;
			windowHeight = $( window ).height() - 50;
			// documentWidth = $( document ).width();
			windowWidth = $( window ).width();
			nbRows = 2*Math.floor((windowHeight / gridInfs.nbRow)/2) - 1;
			nbBeads = 2*Math.floor((windowWidth / gridInfs.nbBead)/2) - 4;
		}
		
		//initialisation
		(function init(){
			if(pattern){ // Si on a déjà qqch d'enregistré en localStorage
				restoreGrid(pattern);
				colorCountUpdate();
			} else {
				gridDetails();
				createGrid();
			}
			gridEventsBinds();
		})();
		
		// Comptage nombre couleur d'un schema affiché
		function colorCountUpdate(){
			var col = $(".grid .box[data-color]");
			$.each(col, function(key, bead){
				subpub.emit("colorCount", {color:$(bead).attr('data-color'), value:1});
			});
		}
		
		// RAZ nombre couleur d'un schema affiché
		function colorCountRAZ(){
			var col = $(".grid .box[data-color]");
			$.each(col, function(key, bead){
				subpub.emit("colorCount", {color:$(bead).attr('data-color'), value:-1});
			});
		}
		
		
		// Création d'une ligne
		function createRow(){
			for(var j=0; j< (nbBeads); j++){
				$beadRow.append(beadCell);
			}
		}
		
		// Création de la grille
        // une perle = 16px x 14px
		function createGrid(){
			createRow();
			for(var i=0; i<=nbRows; i++){
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
			$($btn).notify("Enregistré", { elementPosition:"right middle", className: "success" });
		}
		
		// Coloration d'une perle
		function colorBead(bead, colorB = color){
			 // console.log('color', bead, colorB);
		  if(colorB){
			  if($(bead).attr('data-color')) subpub.emit("colorCount", {color:$(bead).attr('data-color'), value:-1});
			  //$(bead).css("background-color", color);
			  var browserPrefix = ["-moz-", "-webkit-", ""];
			  $.each(browserPrefix, function(key, prefix){
				  $(bead).css("background", prefix+"linear-gradient("+gridInfs.colAngle+", "+ colorB +" 0%,rgba(255,255,255,0.3) 30%,rgba(255,255,255,0.3) 60%,"+ colorB +" 99%), "+ colorB +"");
			  });
			  $(bead).attr('data-color', colorB);
			  subpub.emit("colorCount", {color:colorB, value:1});
		  }else{
			  unColorBead($(bead));
		  }
		}
		
		// Décoloration d'une perle
		function unColorBead($bead){
			var colorB = $bead.attr('data-color');
			$bead.removeAttr('style data-color');
			subpub.emit("colorCount", {color:colorB, value:-1});
		}
		
		// RAZ grille
		function clearGrid(){
			subpub.emit("colorCountRAZ");			
			unColorBead($grid.children().children());
		}
		
		// Changement orientation perles
		function beadDirChange(newDir){
			// Execution que si nouvelle direction différent de la direction de la grille actuelle
			if($(".grid").attr('data-gridDir') != newDir){
				// MAJ perle direction avec nouvelle direction
			beadDir = newDir;
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
			gridUpdate();
			
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
		
		function gridUpdate(beadDir){
			gridDetails();
			
			var $rows = $(".row");
			var $beads = $(".box");
			// Si nombre de lignes actuel est suppérieur à nouveau nb lignes, retire les dernière x lignes
			if($rows.length > nbRows){
				var nbRowsToRemove = $rows.length - nbRows;
					//retire lignes en fin
					$rows.slice(-nbRowsToRemove / 2).remove();
					//retire lignes en début
					$rows.slice(0, nbRowsToRemove / 2).remove();
			}			
			// Si nombre de lignes actuel est inférieur à nouveau nb lignes, ajout de x lignes
			if($rows.length < nbRows){
				var nbRowsToAdd =  nbRows - $rows.length;
				var $row = $rows.last();
				$row.find('.box').removeAttr('style data-color');
				for(var i = 0; i < nbRowsToAdd / 2; i++){
					$row.clone().appendTo('.grid');
					$row.clone().prependTo('.grid');
				}
			}
			
			var nbBoxPerRow = $beads.length / $rows.length;			
			// Si nombre de perles actuel est inférieur à nouveau nb perles, ajout de x perles
			if(nbBoxPerRow < nbBeads){
				var nbBoxToAdd = Math.floor(nbBeads - nbBoxPerRow);
				for(var j=0; j < (nbBoxToAdd / 2); j++){
					$('.row .box:last').clone().removeAttr('style data-color').insertAfter($('.row').find('.box:last'));
					$('.row .box:first').clone().removeAttr('style data-color').insertBefore($('.row').find('.box:first'));
				}
			}
			// Si nombre de perles actuel est suppérieur à nouveau nb perles, suppression de x perles
			if(nbBoxPerRow > nbBeads){
				var nbBoxToRemove = Math.ceil(nbBoxPerRow - (nbBeads));
				for(var k=0; k < nbBoxToRemove / 2; k++){
					$('.row').find('.box:last').remove();
					$('.row').find('.box:first').remove();				
				}
			}
			
			// Création des écouteurs d'événements une fois la grille reconstruite
			gridEventsBinds();
		}
		
		//Gestion des événements sourie/touch
		function gridEventsBinds(){
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
		}
		
		
		function clickBead(target){
			var bead = target ? target : event.target;		
			var prevColor = bead.attr("data-color") || '';
			if(prevColor != color){
				subpub.emit("clickBead", bead);
				subpub.emit("toUndoList", {action:'colorBead', params:{bead: bead , prevColor: prevColor, color: color} });				
			}
		}
		
	})();


	// Module logger
	var logger = (function(){
		//bind events
		subpub.on("toUndoList", undoList);
		subpub.on("undoAction", undoAction);
		
		//Mise en liste undo
		function undoList(data){
			var undoList = localStorage["undoList"] ? JSON.parse(localStorage["undoList"]) : [];
			var data = data;
			// Si un élément perle (bead) est dans les paramètres, on le remplace par son index dans la grille pour sauvegarde
			if(data.params.bead){
				data.params.bead = getBeadIndex(data.params.bead);
			}			
			undoList.push(data);
			localStorage["undoList"] = JSON.stringify(undoList);
		}
		
		// Fonction retour arrière (undo)
		function undoAction(){
			var undoList = localStorage["undoList"] ? JSON.parse(localStorage["undoList"]) : [];
			// Si la liste retour n'est pas vide
			if(undoList.length > 0){
				var lastAction = ($(undoList).get(-1));
				// Si la définition d'une perle (bead) est dans les paramètres, on transforme l'index sauvegardé en élément DOM
				if(lastAction.params.bead){
					lastAction.params.bead = getIndexBead(lastAction.params.bead);
				}
				subpub.emit(lastAction.action, lastAction.params);
				undoList.pop();
				localStorage["undoList"] = JSON.stringify(undoList);				
			}else{
				localStorage.removeItem("undoList");
			}			
		}
		
		// Récupère index d'une perle
		function getBeadIndex(bead){
			var index = $('.box').index($(bead));
			return(index);
		}
		
		// Récupère élement DOM perle d'un index
		function getIndexBead(index){
			var bead = $('.box').get(index);
			return(bead);
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

