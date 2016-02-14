function Music(songName, context, url) {
    // the web audio context
    this.audioContext = context;
    // name of the song
    this.name = songName;
    // url of this song
    this.url = url;
	this.decodedSound;
	this.bufferSource;
    // master volume of this song
    //this.volume = 1;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;
	this.timeStartOnAudioContext;
	
    // song is paused ?
    this.paused = true;

    // song is muted ?
    this.muted = false;

	this.gainNode = this.audioContext.createGain();
	
	var filter = this.audioContext.createBiquadFilter();
	
  	// variables temps
	var lastTime = 0;
	var currentTime = 0;
	var delta;

	// GRAPHE AUDIO (permet de connecter les noeuds à la source) /////
	this.buildGraph = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;
		this.bufferSource.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.bufferSource.connect(filter);
		filter.connect(this.audioContext.destination);

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
		this.bufferSource.start(0,this.elapsedTimeSinceStart);
		this.paused = false;	
    };
	
	this.stop = function (type) {
		if ( type === "stop") {
			this.elapsedTimeSinceStart = 0;
			this.stopProgressBar();
		}
/*		else {
		var timeStopOnAudioContext = this.audioContext.currentTime;
		this.elapsedTimeSinceStart += (timeStopOnAudioContext-this.timeStartOnAudioContext);
		}*/
		this.bufferSource.stop();
		this.paused = true;
	};

	//volume control
	this.changeVolume = function(volume) {
	    this.gainNode.gain.value = volume;
	};

	//filtre lowpass
	this.lowpass = function(freq) {
		filter.frequency.value = freq;
	};
	
	//filtre quality
	/*this.FiltreQuality = function(quality) {
		filter.frequency.value = quality;
	};*/

	/////////////////  PROGRESS BAR + DISPLAYING TIME /////////////////
    // time
    this.getDuration = function () {
        if (this.bufferSource.buffer !== undefined) { // this.bufferSource.buffer par sur
            return this.decodedSound.duration;
        }
        return undefined;
    };

    this.animateTime = function() {
        if (!this.paused) {
        	//current time correct en enlevant le temps mort avant le play
            currentTime = this.audioContext.currentTime - this.timeStartOnAudioContext;
            // delta = le temps "courant" de la musique, moins ce qu'il reste du morceaux
            var delta = currentTime - lastTime;
            if (this.decodedSound !== undefined) {                 
                //View.frontCanvasContext.strokeStyle = "white";
                //rajout du temps pour le temps total passe
                this.elapsedTimeSinceStart += delta;
                //temps precedent 
                lastTime = currentTime;

                // quand on met le son sur stop = this.elapsedTimeSinceStart = 0;
                if (this.elapsedTimeSinceStart > this.getDuration()) {
                    this.elapsedTimeSinceStart = 0;
                }
            }
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
		$('#seekbar').attr("value",  this.elapsedTimeSinceStart);
		//affichage temps
		$('#progressTime').text((this.elapsedTimeSinceStart+"").toFormattedTime());

	}

	this.stopProgressBar = function() {
		$('#seekbar').attr("value", 0);
		//console.log(this.getDuration());
	}

	
}


	
