function PlayList(){
	this.playList = [];
	this.choix = 0;

	var firstTime = true;

	this.change = function(e){
		var file = e.currentTarget.files[0];
		objectUrl = URL.createObjectURL(file);
		var music = new Music(file.name.replace(".mp3",""), ctx, objectUrl);
		this.playList.push(music);
		//deuxieme musique charge alors fistTime faux 
		if(this.playList.length>1){
			firstTime = false;
		}
		/*$("#filename").text(music.name);*/
    	$("#audioPlayer").prop("src", objectUrl);
		this.loadSoundUsingAjax(music,firstTime);
	}


	this.loadSoundUsingAjax =  function(music, fT) {
		var request = new XMLHttpRequest();
  		var liste = [];
		request.open('GET', music.url, true);
		// Important: we're loading binary data
		request.responseType = 'arraybuffer';
		//si premiere fois alors copie playlist car pas acces dans fonction interne
		if(fT){
			liste = this.playList;
		}
		// Decode asynchronously
		request.onload = function() {
			console.log("Sound loaded");
			// Let's decode it. This is also asynchronous
			ctx.decodeAudioData(request.response, function(buffer) {
				console.log("Sound decoded");
				music.decodedSound = buffer;
				// si premiere fois 
				if(fT){
					liste[0].draw();	
					liste[0].buildGraph();	
					liste[0].play();
					document.getElementById("song0").className="";
					document.getElementById("song0").className="hoverClickplay";
				}
			}, function(e) {
			console.log("error");});
		};
    	// send the request. When the file will be loaded,
    	// the request.onload callback will be called (above)
		request.send();
	}

	//change le choix
	this.changeChoix = function(i){
		
		/*document.getElementById("song0").className="hoverClickpause";*/
		document.getElementById("song"+this.choix).className="";
		document.getElementById("song"+this.choix).className="hoverClickpause";
		
		this.playList[this.choix].stop("stop"); 

		// changement du choix 
		this.choix=i;
		document.getElementById("song"+this.choix).className="";
		document.getElementById("song"+this.choix).className="hoverClickplay";

		// reconstruction
		this.playList[this.choix].buildGraph();

		// on joue la musique
		this.playList[this.choix].draw();
		this.playList[this.choix].play();
}


	// chanson suivante
	this.nextSong = function(){
		var i =this.choix;
		i++;
		//si fin playlist retour a la premiere chanson
		if(i == this.playList.length){
			i = 0;
		}
		// changement musique 
		this.changeChoix(i);
	}

	// chanson precedente
	this.previousSong = function(){
		var i =this.choix;
		i--;
		//si debut playlist retour a la premiere chanson
		if(i < 0){
			i = (this.playList.length-1);
		}
		// changement musique
		this.changeChoix(i);
	}

}