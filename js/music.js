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

    // song is paused ?
    this.paused = true;

    // song is muted ?
    this.muted = false;


	this.gainNode = this.audioContext.createGain();
	console.log("valeur biatch :" + this.gainNode.gain.value); 
	this.mySource;

	this.load = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;
		//this.bufferSource.connect(this.audioContext.destination);

		this.bufferSource.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
	};
		

	this.play = function () {console.log(this.bufferSource);
		this.bufferSource.start();
        this.paused = false;
    };
	
	this.stop = function () {
		//a calculer//this.elapsedTimeSinceStart = ;
		this.bufferSource.stop();console.log(this.bufferSource);
		this.paused = true;
	};





	//volume control

	this.changeVolume = function(element) {
	    var volume = element.value;
	    var fraction = volume / element.max ;
 		console.log("valeur"+element.value);
	
 		 this.gainNode.gain.value = volume;
	   // this.gainNode.gain.value = fraction* fraction;
	    //this.gainNode.gain.changeVolume.value =  fraction * 30;
	    console.log(element.value);
	    console.log(this.gainNode.gain.value);      // Console log of gain value when slider is moved
	};


}