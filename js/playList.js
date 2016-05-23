function PlayList(ctx, audioPlayer,seekbar,progressTime){
	this.playList = [];
	this.choix = 0;

	// the web audio context
	this.audioContext = ctx;
	this.gainNode = this.audioContext.createGain();
	//filtre
	
	var fil = this.audioContext.createBiquadFilter();
	fil.type = "lowpass";
	fil.frequency.value = 5000;
	//filtre HP
	var filHP = this.audioContext.createBiquadFilter();
	filHP.type = "highpass";
	
	this.speedSound = 1;
	//premiere fois 
	var firstTime = true;
////////////////////////////DISTORSION////////////////
	var distorsion = this.audioContext.createWaveShaper();
///////////////////REVERB////////////////////////
	var convolver = this.audioContext.createConvolver();
	
/////////////// CREATION ANALYSEUR DE SPECTRE/////////////////
	var analyser = this.audioContext.createAnalyser();
	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = 0.3;
	analyser.maxDecibels = 0;
	
	// on récupère les canvas que l'on veut animer

////////////////////FONCTION QUI AFFICHE LE SPECTRE 1 EN BAR///////////////////////
	function draw() {
	
	if (seekbar === "seekbar") {
		canvas = document.getElementById("BarSpectre1");
	}
	else {
		canvas = document.getElementById("BarSpectre2");
	}
	var canvasCtx = canvas.getContext("2d");
	var drawVisual;
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
	var bufferLength = analyser.frequencyBinCount; //buffer qui va contenir les données à afficher
	var tailleMemoireTampon = analyser.fftSize;
	var freqDomain = new Uint8Array(bufferLength); 
	
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(freqDomain);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
	  
	  var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
	  
	  for(var i = 0; i < bufferLength; i++) {
        barHeight = freqDomain[i]/2;

        canvasCtx.fillStyle = 'rgb(16 ,108,135)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
      }
    };
	draw();

////////////////////FONCTION QUI AFFICHE LE SPECTRE 1 EN ENTIER /////////////
	var canvasE1 = document.getElementById("spectre1");
	var canvasCtxE1 = canvasE1.getContext("2d");
	var drawVisualE1;
	
function drawEntier1() {
	var bufferLength = analyser.frequencyBinCount; //buffer qui va contenir les données à afficher
	var tailleMemoireTampon = analyser.fftSize;
	var freqDomain = new Uint8Array(bufferLength); 
      drawVisualE1 = requestAnimationFrame(drawEntier1);
      analyser.getByteFrequencyData(freqDomain);

      canvasCtxE1.fillStyle = 'rgb(200, 200, 200)';
      canvasCtxE1.fillRect(0, 0, WIDTH, HEIGHT);
	  
    };
	drawEntier1();
/////////////////FONCTION QUI AFFICHE LE SPECTRE 2 EN ENTIER /////////////
	var canvasE2 = document.getElementById("spectre2");
	var canvasCtxE2 = canvasE2.getContext("2d");
	var drawVisualE2;
	
function drawEntier2() {
	var bufferLength = analyser.frequencyBinCount; //buffer qui va contenir les données à afficher
	var tailleMemoireTampon = analyser.fftSize;
	var freqDomain = new Uint8Array(bufferLength); 
      drawVisualE2 = requestAnimationFrame(drawEntier2);
      analyser.getByteFrequencyData(freqDomain);

      canvasCtxE2.fillStyle = 'rgb(200, 200, 200)';
      canvasCtxE2.fillRect(0, 0, WIDTH, HEIGHT);
    };
	drawEntier2();

/////////////// Création equaliser/////////////////
		// BASS
	var lowFil = this.audioContext.createBiquadFilter();
	lowFil.type = "lowshelf";
	lowFil.frequency.value = 600 ;// les fréquences en dessous de 600 seront atténuées ou amplifiées
		//MEDIUM
	var medFil = this.audioContext.createBiquadFilter();
	medFil.type = "peaking";
	medFil.frequency.value = 1620;
		//AIGUE
	var trebFil = this.audioContext.createBiquadFilter();
	trebFil.type = "highshelf";
	trebFil.frequency.value = 3500;

	this.taille = -1;
	///////////////////FIN EQUALISER////////////////////////////
		
	this.change = function(e){
		var file = e.currentTarget.files[0];
		var type = file.type;
		var size = file.size;
		objectUrl = URL.createObjectURL(file);
		var music = new Music(file.name.replace(".mp3",""), objectUrl, this.audioContext, this.gainNode, fil, lowFil, medFil, trebFil, this.speedSound,seekbar,progressTime);
		this.playList.push(music);
		//deuxieme musique charge alors fistTime faux 
		if(this.playList.length>1){
			firstTime = false;
		}
		/*$("#filename").text(music.name);*/
    	$("#"+audioPlayer).prop("src", objectUrl);
		this.loadSoundUsingAjax(this.audioContext,music,firstTime,type,size,this.taille);
		this.taille++;
	}

	this.loadSoundUsingAjax =  function(audioContext, music, fT,type,size,ta) {
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

			music.limitCharacters();
 
			console.log("Sound loaded");
			// Let's decode it. This is also asynchronous
			audioContext.decodeAudioData(request.response, function(buffer) {

			console.log("Sound decoded");
			music.decodedSound = buffer;
			music.inverseDecodedSound = inverseBuffer(audioContext,buffer);

			music.limitCharacters();

		// si premiere fois 
			if(fT){
				liste[0].draw();	
				liste[0].buildGraph();	
				/* enclencher le play dès la lecture auto de la musique */
				//si premiere playlist
				if(seekbar === "seekbar"){
					liste[0].play();
					pButton.className = "control1 pause";
					document.getElementById("song0").className="";
					document.getElementById("song0").className="hoverClickplay";
				} 	
			}
			ta ++;
			if(seekbar === "seekbar"){
				console.log("1 : " +ta);
				if(liste[ta].paused){
					liste[ta].buildGraph();	
				}
				var total = liste[ta].getDuration()+ "";
				document.getElementById("time1_"+(ta)).innerHTML += total.toFormattedTime();	
				document.getElementById("bpm").innerHTML += liste[ta].tempo;	
				
			}
			else{
				console.log("2 : " +ta);
				if(liste[ta].paused){
					liste[ta].buildGraph();	
				}
				var total = liste[ta].getDuration()+ "";
				document.getElementById("time2_"+(ta)).innerHTML += total.toFormattedTime();	
				document.getElementById("bpm2").innerHTML += liste[ta].tempo;
				document.getElementById("form2").innerHTML += type;
			}
		},function(e) {
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


		if(seekbar === "seekbar"){
			document.getElementById("song"+this.choix).className="";
			document.getElementById("song"+this.choix).className="hoverClickpause";
			
			pButton.className = "";
            pButton.className = "control1 play";
		} else {			
			document.getElementById("song2"+this.choix).className="";
			document.getElementById("song2"+this.choix).className="hoverClickpause";
			pButton2.className = "";
            pButton2.className = "control2_1 play";
		}

		this.playList[this.choix].stop("stop"); 

		// changement du choix 
		this.choix=i;


		if(seekbar === "seekbar"){
			document.getElementById("song"+this.choix).className="";
			document.getElementById("song"+this.choix).className="hoverClickplay";
			
			pButton.className = "";
            pButton.className = "control1 pause";
		} else {			
			document.getElementById("song2"+this.choix).className="";
			document.getElementById("song2"+this.choix).className="hoverClickplay";
			
			pButton2.className = "";
            pButton2.className = "control2_1 pause";
		}
 

		// reconstruction
		this.playList[this.choix].buildGraph();
		//abimation 
		this.playList[this.choix].draw();
		// on joue la musique
		this.playList[this.choix].play();
		//change la rapidite
		this.changeSpeed(this.speedSound);

		this.playList[this.choix].limitCharacters();
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
	
	/////////////////DISTORSION/////////////////////////////////////
	/*function makeDistortionCurve(amount) {
	  var k = typeof amount === 'number' ? amount : 50,
		n_samples = 44100,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
	  for ( ; i < n_samples; ++i ) {
		x = i * 2 / n_samples - 1;
		curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	  }
	  return curve;
	};
	*/
	function makeDistortionCurve(k) {
	  console.log("make disto amount = " + k);
	  var n_samples = this.audioContext.sampleRate,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
	  for ( ; i < n_samples; ++i ) {
		x = i * 2 / n_samples - 1;
		curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	  }
	  return curve;
	}
	
	this.changeDisto = function(value){
		distortion.curve = makeDistortionCurve(value);
		distortion.oversample = '4x';
	}
	/////////////////////////EQUALISER//////////////////////////

	this.volumeLowEq = function(value){
		var eqVol = parseFloat(value) / 100.0;
		lowFil.gain.value= value;
	}
	this.volumeMedEq = function(value){
		var eqVol = parseFloat(value) / 100.0;
		medFil.gain.value= value;
	}
	this.volumeTrebEq = function(value){
		var eqVol = parseFloat(value) / 100.0;
		trebFil.gain.value= value;
	}

	////////////////////// Filtre LowPass ///////////////////////
	
	this.filterLowPass = function(value){
		fil.frequency.value = value;
		fil.Q.value = 5;
		fil.gain.value=40;
	}	
	////////////////////// Filtre HighPass ///////////////////////
	
	this.filterHighPass = function(value){
		filHP.frequency.value = value*(-1);
		filHP.Q.value = 5;
		filHP.gain.value=40;
	}	

	//////////////////////// BOUTON BASS  /////////////////////////
	var bass = document.getElementById("bassButton");
	var activated = 'false';

	bass.onclick = function(){
		if(activated !=="true"){
			fil.frequency.value = 300;
			fil.Q.value = 4;
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