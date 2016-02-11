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

	this.buildGraph = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;
		this.bufferSource.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
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

	this.changeVolume = function(element) {
	    var volume = element.value;
	    var fraction = volume / element.max ;
	
 		 this.gainNode.gain.value = volume;
	   // this.gainNode.gain.value = fraction* fraction;
	    //this.gainNode.gain.changeVolume.value =  fraction * 30;
	};


}