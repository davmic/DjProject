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
    this.volume = 1;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;

    // song is paused ?
    this.paused = true;

    // song is muted ?
    this.muted = false;
	
	this.load = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;
		this.bufferSource.connect(this.audioContext.destination);
		};
		
	this.play = function () {console.log(this.bufferSource);
		this.bufferSource.start();
        this.paused = false;
    };
	
	this.stop = function () {
		this.elapsedTimeSinceStart = this.decodedSound.duration;console.log(this.elapsedTimeSinceStart);
		this.bufferSource.stop();console.log(this.bufferSource);
	};
}