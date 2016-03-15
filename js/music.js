function Music(songName, url, ctx, gainNode, filter, lowFil, medFil, trebFil, speed,seekbar,progressTime) {
    // the web audio context
	this.audioContext = ctx;
    // name of the song
    this.name = songName;
    // url of this song
    this.url = url;
	this.decodedSound;
	this.bufferSource;
	// le buffer qui contient la musique dans le sens inverse
	this.inverseDecodedSound;
    // vitesse du son
    this.speedSound =  speed;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;
	this.timeStartOnAudioContext;
	
    // song is paused ?
    this.paused = true;

    //maj progressbar
    this.maj = 0;
    this.sauvmaj = 0;
	
	
  	// variables temps
	var lastTime = 0;
	var currentTime = 0;
	var delta;

	// GRAPHE AUDIO (permet de connecter les noeuds à la source) /////
	this.buildGraph = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;

		this.bufferSource.connect(filter);	
		filter.connect(lowFil);
		lowFil.connect(medFil);
		medFil.connect(trebFil);
		trebFil.connect(gainNode);
		gainNode.connect(this.audioContext.destination);	
		// Progress bar: valeur maximale = temps du morceaux 
		if($('#'+seekbar).attr("max")!=this.getDuration()){
			$('#'+seekbar).attr("max", this.getDuration());	
		}
	};
		
	
	this.play = function () {
		this.timeStartOnAudioContext = this.audioContext.currentTime;
        // Apres pause donc lastTime a 0 pour ne pas repartir en arriere 
		lastTime=0;
        // appel de la fonction pour le temps de la chanson 
		this.animateTime();
		this.bufferSource.playbackRate.value = this.speedSound;
		this.bufferSource.start(0,this.elapsedTimeSinceStart);
		this.paused = false;	


    };
	
	this.stop = function (type) {
		if ( type === "stop") {
			this.elapsedTimeSinceStart = 0;
			this.stopProgressBar();
		}
		this.speedSound = this.bufferSource.playbackRate.value;
		this.bufferSource.stop();
		this.paused = true;
	};


	/////////////////  PROGRESS BAR + DISPLAYING TIME /////////////////
    // time
    this.getDuration = function () {
        if (this.bufferSource.buffer !== undefined) { // this.bufferSource.buffer par sur
            return this.decodedSound.duration;
        }
        return undefined;
    };

    this.animateTime = function() {
        	//current time correct en enlevant le temps mort avant le play
            currentTime = this.audioContext.currentTime - this.timeStartOnAudioContext;
            
            // delta 1) le temps "courant" de la musique, moins ce qu'il reste du morceaux
            // delta 2) on multiplie le tout par la vitesse du son en reprenant sa valeur (playbackRate.value)
            var delta = (currentTime - lastTime)*this.bufferSource.playbackRate.value;
                    
            //maj temps click seekBar, si sauvegarde diff de la nouvelle maj
           	if(this.sauvmaj != this.maj){
           		//sauvegarde maj
           		this.sauvmaj = this.maj;
           		//musique au temps du click de la seek bar
           		this.elapsedTimeSinceStart = this.maj;
           		//time start
           		this.timeStartOnAudioContext = this.audioContext.currentTime;
           	}

           	// rajout du temps pour le temps total passe
           	this.elapsedTimeSinceStart += delta;
            // temps precedent 
            lastTime = currentTime;

            // quand on met le son sur stop = this.elapsedTimeSinceStart = 0;
            if (this.elapsedTimeSinceStart > this.getDuration()) {
                this.elapsedTimeSinceStart = 0;

            //fin de musique on passe a la suivante 
                if(seekbar === "seekbar"){
                	document.getElementsByClassName('control2 next')[0].click();
                }
                else document.getElementsByClassName('control2_2 next')[0].click();
     		}
    };

    //fonction appelle tout au long de la duree de l'app
    this.draw = function() {
    	if(!this.paused){
			this.progressBar();  
		 } 
		//signale une animation et demande de rappeller la fonction draw
	 	requestAnimationFrame(this.draw.bind(this));
	};

	//barre de progression
	this.progressBar = function() {
		this.animateTime();
		//barre progression
		$('#'+seekbar).attr("value", this.elapsedTimeSinceStart);
		//affichage temps
		$('#'+progressTime).text((this.elapsedTimeSinceStart+"").toFormattedTime());

	}

	this.stopProgressBar = function() {
		$('#'+seekbar).attr("value", 0);
		$('#'+progressTime).text((this.elapsedTimeSinceStart+"").toFormattedTime());
		//console.log(this.getDuration());
	}


	//maj temps click seekbar
	this.majTime = function(value) {
		//maj de la valeur de la musique		
		this.maj = value;
		//si en pause alors on appel progress bar qui met tt a j 
		if(this.paused){
			this.progressBar();	
		}
		//si on est en train de jouer on stop puis play
		else {
			this.stop("stop");
			this.buildGraph();
			this.play();
		}

	}

	// Vitesse du son / speed sound
	this.changeSpeed = function(value) {
		this.bufferSource.playbackRate.value = value;
	}

	////////////////////// LIMIT CHARACTERS ///////////////////////
	
	this.limitCharacters = function(){

		// CURRENT SONG 1: Limit les charactères du titre pour ne pas apparaitre en entier
	 	var limit = 35;
        var chars = $("#currentSong").text(); 
        if (chars.length > limit ) {
            var visiblePart = $("<span> "+ chars.substr(0, limit-1) +"</span>");
            var dots = $("<span class='dots'>... </span>");
            var hiddenPart = $("<span class='more'>"+ chars.substr(limit-1) +"</span>");

            $("#currentSong").empty()
                .append(visiblePart)
                .append(dots)
                .append(hiddenPart);
        }
        // CURRENT SONG 2: Limit les charactères du titre pour ne pas apparaitre en entier
		var limit2 = 35;
        var chars2 = $("#currentSong2").text(); 
        if (chars2.length > limit2) {
            var visiblePart2 = $("<span> "+ chars2.substr(0, limit2-1) +"</span>");
            var dots2 = $("<span class='dots'>... </span>");
            var hiddenPart2 = $("<span class='more'>"+ chars2.substr(limit2-1) +"</span>");

            $("#currentSong2").empty()
                .append(visiblePart2)
                .append(dots2)
                .append(hiddenPart2);
        }
	}	
}


	
