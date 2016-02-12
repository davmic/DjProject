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
	filter.type = (typeof filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
	filter.frequency.value = 5000;
  
	// GRAPHE AUDIO (permet de connecter les noeuds à la source) /////
	this.buildGraph = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;
		this.bufferSource.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.bufferSource.connect(filter);
		filter.connect(this.audioContext.destination);
	};
		

	this.play = function () {
		this.timeStartOnAudioContext = this.audioContext.currentTime;
		this.bufferSource.start(0,this.elapsedTimeSinceStart);
        this.paused = false;
    };
	
	this.stop = function (type) {
		if ( type === "stop") {
			this.elapsedTimeSinceStart = 0;
		}
		else {
		var timeStopOnAudioContext = this.audioContext.currentTime;
		this.elapsedTimeSinceStart += (timeStopOnAudioContext-this.timeStartOnAudioContext);
		}
		this.bufferSource.stop();
		this.paused = true;
	};

	//volume control
	this.changeVolume = function(volume) {
	    this.gainNode.gain.value = volume;
	};

	//filtre lowpass
	this.FiltreLowPass = function(lowpass) {
		filter.frequency.value = lowpass;
	};
	
	//filtre quality
	this.FiltreQuality = function(quality) {
		filter.frequency.value = quality;
	};
	
}