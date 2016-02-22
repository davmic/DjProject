function Music(songName, context, url, ac, gainNode, filter, speed) {
    // the web audio context
   // this.audioContext = context;
   this.audioContext = ac ;
    // name of the song
    this.name = songName;
    // url of this song
    this.url = url;
	this.decodedSound;
	this.bufferSource;
    // vitesse du son
    this.speedSound =  speed;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;
	this.timeStartOnAudioContext;
	
    // song is paused ?
    this.paused = true;

    // song is muted ?
    this.muted = false;

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
		filter.connect(gainNode);
		gainNode.connect(this.audioContext.destination);
				
		// Progress bar: valeur maximale = temps du morceaux 
		if($('#seekbar').attr("max")!=this.getDuration()){
			$('#seekbar').attr("max", this.getDuration());	
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
        /*else {
		var timeStopOnAudioContext = this.audioContext.currentTime;
		this.elapsedTimeSinceStart += (timeStopOnAudioContext-this.timeStartOnAudioContext);
		}*/
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
            //if (this.decodedSound !== undefined) {                 
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
                }
            //}
      //   else{
      //        if(this.sauvmaj != this.maj){
      //      		this.sauvmaj = this.maj;
      //      		this.elapsedTimeSinceStart = this.maj;
      //      		this.elapsedTimeSinceStart += delta;
      //      	}
      //   }  
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
		$('#seekbar').attr("value", this.elapsedTimeSinceStart);
		//affichage temps
		$('#progressTime').text((this.elapsedTimeSinceStart+"").toFormattedTime());

	}

	this.stopProgressBar = function() {
		$('#seekbar').attr("value", 0);
		$('#progressTime').text((this.elapsedTimeSinceStart+"").toFormattedTime());
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
}


	
