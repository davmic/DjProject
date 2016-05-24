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
	
	// variables pour la platine
	this.platine;
	var mousedown = false;
	var x=0;
	var y=0;
	var oldangle;
	var oldDate;
	var tmpPause;
	var tmpLecture = false;
	var idTimeOut;
	var timeOutPause = false;


////////////////////////////DISTORSION////////////////
	var distorsion = this.audioContext.createWaveShaper();
///////////////////REVERB////////////////////////
	var convolver = this.audioContext.createConvolver();
	
/////////////// CREATION ANALYSEUR DE SPECTRE/////////////////
	var analyser = this.audioContext.createAnalyser();
	

////////////////////FONCTION QUI AFFICHE LES DIFFERENTES FREQUENCES AUDIO SOUS FORME DE BAR///////////////////////
	function draw() {
	
	if (seekbar === "seekbar") {
		canvas = document.getElementById("BarSpectre1");
	}
	else {
		canvas = document.getElementById("BarSpectre2");
	}
	var canvasCtx = canvas.getContext("2d");
	var drawVisual;
	
	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = 0.3;
	analyser.maxDecibels = 0;
	
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

////////////////////FONCTION QUI AFFICHE LE SPECTRE AUDIO SOUS FORME D'ONDE /////////////
	
function drawWave() {
	
	if (seekbar === "seekbar") {
		canvasE1 = document.getElementById("spectre1");
	}
	else {
		canvasE1 = document.getElementById("spectre2");
	}
	var canvasCtxE1 = canvasE1.getContext("2d");
	var drawVisualE1;
	analyser.fftSize =1024;
	
	var bufferLength = analyser.fftSize;
    var dataArray = new Float32Array(bufferLength);
	  
	  drawVisualE1 = requestAnimationFrame(drawWave);

      analyser.getFloatTimeDomainData(dataArray);

      canvasCtxE1.fillStyle = 'rgb(16, 108, 135)';
      canvasCtxE1.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtxE1.lineWidth = 2;
      canvasCtxE1.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtxE1.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] * 200.0;
        var y = HEIGHT/2 + v;

        if(i === 0) {
          canvasCtxE1.moveTo(x, y);
        } else {
          canvasCtxE1.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtxE1.lineTo(canvasE1.width, canvasE1.height/2);
      canvasCtxE1.stroke();
    };
	drawWave();

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

	this.taille = 0;
	///////////////////FIN EQUALISER////////////////////////////
		
	this.change = function(e){
		var file = e.currentTarget.files[0];
		var type = file.type;
		var size = file.size;
		objectUrl = URL.createObjectURL(file);
		var music = new Music(file.name.replace(".mp3",""), objectUrl, this.audioContext, this.gainNode, fil , filHP, analyser,  lowFil, medFil, trebFil, this.speedSound,seekbar,progressTime,this.platine,mousedown);
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
		liste = this.playList;
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
			if(seekbar === "seekbar"){
				if(liste[ta].paused){
					liste[ta].buildGraph();	
				}
				var total = liste[ta].getDuration()+ "";
				document.getElementById("time1_"+(ta)).innerHTML += total.toFormattedTime().substring(0,4);	
				document.getElementById("bpm1_"+(ta)).innerHTML += liste[ta].tempo;	
				document.getElementById("format1_"+(ta)).innerHTML += type.replace("audio/", ".");;
				document.getElementById("size1_"+(ta)).innerHTML += size.toString().substring(0,2) + " MB";
				
			}
			else{
				if(liste[ta].paused){
					liste[ta].buildGraph();	
				}
				var total = liste[ta].getDuration()+ "";
				document.getElementById("time2_"+(ta)).innerHTML += total.toFormattedTime().substring(0,4);	
				document.getElementById("bpm2_"+(ta)).innerHTML += liste[ta].tempo;	
				document.getElementById("format2_"+(ta)).innerHTML += type.replace("audio/", ".");;
				document.getElementById("size2_"+(ta)).innerHTML += size.toString().substring(0,2) + " MB";
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
	 // console.log("make disto amount = " + k);
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
	
	// Action sur la platine
	this.changePlatine = function(evt) {
	
		if (mousedown) {
			clearTimeout(idTimeOut);
			var date = Date.now();
			// return relative mouse position
			x = evt.clientX - this.platine.x - this.platine.width/2 + window.pageXOffset;
			y = (evt.clientY - this.platine.y - this.platine.height/2 + window.pageYOffset) * -1;

			angle = Math.atan2(x, y);
			var angleDegre = angle * 180/Math.PI;
			if (x < 0) {
				angleDegre += 360; 
			}
			//console.log("l'angle : " + angleDegre);
			this.platine.style.transform = "rotate("+angleDegre+"deg)";
			
			if(oldangle !== undefined) {
				var da = angle - oldangle;
				var dt = date - oldDate;
				//console.log(da,x,y,angle,oldangle);
				//console.log("da : "+da+",dt : "+dt+", v : "+((Math.abs(da)/dt)/0.0015));
				this.playList[this.choix].changeSpeed((Math.abs(da)/dt)/0.0015);
				//console.log("to : "+timeOutPause);
				// Si on passe de la music a l'envers vers la music a l'endroit
				if (da > 0 && da < 4 && this.playList[this.choix].bufferSource.buffer === this.playList[this.choix].inverseDecodedSound) {
					this.playList[this.choix].stop("pause");
					this.playList[this.choix].elapsedTimeSinceStart = this.playList[this.choix].getDuration() - this.playList[this.choix].elapsedTimeSinceStart;
					this.playList[this.choix].buildGraph2(1);
					this.playList[this.choix].play();
					tmpLecture = true;
				}
				// Si on passe de la music a l'endroit vers la music a l'envers 
				else if (da < 0 && da > -4 && this.playList[this.choix].bufferSource.buffer === this.playList[this.choix].decodedSound) {
					this.playList[this.choix].stop("pause");
					this.playList[this.choix].elapsedTimeSinceStart = this.playList[this.choix].getDuration() - this.playList[this.choix].elapsedTimeSinceStart;
					this.playList[this.choix].buildGraph2(-1);
					this.playList[this.choix].play();
					tmpLecture = true;
				}
				// Si la musique etait en pause avant qu'on touche la platine ou en pause apres un timeout et si on ne l'a pas reactive auparavant
				else if ((tmpPause || timeOutPause) && !tmpLecture) {
					tmpLecture = true;
					timeOutPause = false;
					this.playList[this.choix].buildGraph2(1);
					this.playList[this.choix].play();
				}
			}
			oldangle = angle;
			oldDate = date;
			
			idTimeOut = setTimeout(function() {
				var playlist;
				if (seekbar === "seekbar") {
					playlist = playList1;
				}
				else {
					playlist = playList2;
				}
				//console.log("timeout");
				timeOutPause = true;
				tmpLecture = false;
				playlist.playList[playlist.choix].stop("pause");
			}, 500);
			
		}
	}
	
	this.mouseDown = function() {
		tmpPause = this.playList[this.choix].paused;
		mousedown = true;
		this.playList[this.choix].setMouseDown(true);
	}
	
	this.mouseUp = function() {
		clearTimeout(idTimeOut);//console.log("coucou");
		// Si je lisais la musique a l'envers, je la remet a l'endroit
		if (this.playList[this.choix].bufferSource.buffer === this.playList[this.choix].inverseDecodedSound) {
			this.playList[this.choix].stop("pause");
			this.playList[this.choix].elapsedTimeSinceStart = this.playList[this.choix].getDuration() - this.playList[this.choix].elapsedTimeSinceStart;
			// Si il n'y avait pas la pause avant qu'on touche la platine on reprend la lecture de la musique a l'endroit
			if (!tmpPause) {
				this.playList[this.choix].buildGraph2(1);
				this.playList[this.choix].play();
			}
		}
		// Si il n'y avait pas la pause et qu'il y a eu un timeout apres avoir touche la platine
		else if (!tmpPause && timeOutPause) {
			this.playList[this.choix].buildGraph2(1);
			this.playList[this.choix].play();
		}
		// Si il y avait la pause avant qu'on touche la platine 
		if (tmpPause && tmpLecture) {
			this.playList[this.choix].stop("pause");
		}
		mousedown = false;
		this.playList[this.choix].setMouseDown(false);
		tmpLecture = false;
		timeOutPause = false;
		oldangle = undefined;
		oldDate = undefined;
		var speedSlider;
		if (seekbar === "seekbar") {
			speedSlider = "speedSoundSlider";
		}
		else {
			speedSlider = "speedSoundSlider2";
		}
		this.playList[this.choix].changeSpeed(document.getElementById(speedSlider).value);
	}
	
}