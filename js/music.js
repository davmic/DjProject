function Music(songName, context, url) {
    // the web audio context
   // this.audioContext = context;
   this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // name of the song
    this.name = songName;
    // url of this song
    this.url = url;
	this.decodedSound;
	this.bufferSource;
    // vitesse du son
    this.speedSound = 1;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;
	this.timeStartOnAudioContext;
	
    // song is paused ?
    this.paused = true;

    // song is muted ?
    this.muted = false;

	
	var gainNode = this.audioContext.createGain();
	
	//filtre
	var filter = this.audioContext.createBiquadFilter();
	filter.frequency.value = 5000;	
	
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
		
		/*this.bufferSource.connect(gainNode);
		gainNode.connect(this.audioContext.destination);	
		this.bufferSource.connect(filter);
		filter.connect(this.audioContext.destination);	
		*/			
		// Progress bar: valeur maximale = temps du morceaux 
		if($('#seekbar').attr("max")!=this.getDuration()){
			$('#seekbar').attr("max", this.getDuration());	
		}
	};
		
	/*this.buildGraphFilter = function () {
	};*/
	
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

	//volume control
	this.changeVolume = function(volume) {
	    gainNode.gain.value = volume;
	};
	
////////////////////// Filtre LowPass ///////////////////////
	filterLP = document.getElementById("filterLP");
	
	filterLP.oninput = function(){
		var x = document.getElementById("filterLP").value;
		filter.frequency.value = x;
	};	
		
//////////////////////// BOUTON BASS  /////////////////////////
	var bass = document.getElementById("bassButton");
	var activated = 'false';

	bass.onclick = function(){

		if(activated !=="true"){
			filter.type = 'lowpass' ; // LOWPASS
			filter.frequency.value = 300;
			filter.gain.value=40;
			activated= "true";
		}
		else{
			filter.frequency.value = 5000;
			activated = "false";
		}
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
        if (!this.paused) {
        	//current time correct en enlevant le temps mort avant le play
            currentTime = this.audioContext.currentTime - this.timeStartOnAudioContext;
            
            // delta 1) le temps "courant" de la musique, moins ce qu'il reste du morceaux
            // delta 2) on multiplie le tout par la vitesse du son en reprenant sa valeur (playbackRate.value)
            var delta = (currentTime - lastTime)*this.bufferSource.playbackRate.value;
            if (this.decodedSound !== undefined) {                 
                // rajout du temps pour le temps total passe
                this.elapsedTimeSinceStart += delta;
                // temps precedent 
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
		$('#seekbar').attr("value", this.elapsedTimeSinceStart);
		//affichage temps
		$('#progressTime').text((this.elapsedTimeSinceStart+"").toFormattedTime());

	}

	this.stopProgressBar = function() {
		$('#seekbar').attr("value", 0);
		$('#progressTime').text((this.elapsedTimeSinceStart+"").toFormattedTime());
		//console.log(this.getDuration());
	}

	// Vitesse du son / speed sound
	this.changeSpeed = function(value) {
		this.bufferSource.playbackRate.value = value*2;
	}
}


	
