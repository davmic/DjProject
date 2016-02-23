function PlayList(ctx){
	this.playList = [];
	this.choix = 0;

	// the web audio context
	this.audioContext = ctx;
	this.gainNode = this.audioContext.createGain();
	//filtre
	var fil = this.audioContext.createBiquadFilter();
	fil.frequency.value = 5000;
	this.speedSound = 1;

	//premiere fois 
	var firstTime = true;





	this.change = function(e){
		var file = e.currentTarget.files[0];
		objectUrl = URL.createObjectURL(file);
		var music = new Music(file.name.replace(".mp3",""), objectUrl, this.audioContext, this.gainNode, fil, this.speedSound);
		this.playList.push(music);
		//deuxieme musique charge alors fistTime faux 
		if(this.playList.length>1){
			firstTime = false;
		}
		/*$("#filename").text(music.name);*/
    	$("#audioPlayer").prop("src", objectUrl);
		this.loadSoundUsingAjax(this.audioContext,music,firstTime);
	}

	this.loadSoundUsingAjax =  function(audioContext, music, fT) {
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
			audioContext.decodeAudioData(request.response, function(buffer) {
				console.log("Sound decoded");
				music.decodedSound = buffer;
				music.inverseDecodedSound = inverseBuffer(audioContext,buffer);
				// si premiere fois 
				if(fT){
					liste[0].draw();	
					liste[0].buildGraph();	
					liste[0].play();
					document.getElementById("song0").className="";
					document.getElementById("song0").className="hoverClickplay";
					pButton.className = "control1 pause";

				}
			}, function(e) {
			console.log("error");});
		};
    	// send the request. When the file will be loaded,
    	// the request.onload callback will be called (above)
		request.send();
	}
	
	// avoir un buffer qui contient la musique inversée
	function inverseBuffer(audioContext,buffer) {
		var newBuffer = audioContext.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
		if (newBuffer) {
			var length = buffer.length;
			for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
				var oldBuf = buffer.getChannelData(channel);
				var newBuf = newBuffer.getChannelData(channel);
				for (var i = 0; i < length; i++) {
					newBuf[length-i-1] = oldBuf[i];
				}
			}
		}
		return newBuffer;
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
		//abimation 
		this.playList[this.choix].draw();
		// on joue la musique
		this.playList[this.choix].play();
		//change la rapidite
		this.changeSpeed(this.speedSound);
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





	////////////////////// Filtre LowPass ///////////////////////
	
	this.filterLowPass = function(value){
		fil.frequency.value = value;
		fil.Q.value = 10;
	}	
		
	//////////////////////// BOUTON BASS  /////////////////////////
	var bass = document.getElementById("bassButton");
	var activated = 'false';

	bass.onclick = function(){
		if(activated !=="true"){
			fil.type = 'lowpass' ; // LOWPASS
			fil.frequency.value = 300;
			fil.Q.value = 10;
			fil.gain.value=40;
			activated= "true";
		}
		else{
			fil.frequency.value = 5000;
			activated = "false";
		}
	}

	// volume control
	this.changeVolume = function(volume) {
	    this.gainNode.gain.value = volume;
	}	

	// Vitesse du son / speed sound
	this.changeSpeed = function(value) {
		//changer rapidite de la musique
		this.speedSound = value;
		this.playList[this.choix].changeSpeed(this.speedSound);
	}
}