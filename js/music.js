function Music(songName, url, ctx, gainNode, filter, filHP, analyser, lowFil, medFil, trebFil, speed,seekbar,progressTime,platine,mousedown) {
    // the web audio context
	this.audioContext = ctx;
    // name of the song
    this.name = songName;
    // url of this song
    this.url = url;
     //tempo de la musique (bpm)
  	this.tempo;
	this.decodedSound;
	this.bufferSource;
	// le buffer qui contient la musique dans le sens inverse
	this.inverseDecodedSound;
    // vitesse du son
    this.speedSound =  speed;
    // elapsed time (since beginning, in seconds (float))
    this.elapsedTimeSinceStart = 0;
	this.timeStartOnAudioContext;
	
    // song is paused ?
    this.paused = true;
    this.mousedown = mousedown;

    //maj progressbar
    this.maj = 0;
    this.sauvmaj = 0;
	
	
  	// variables temps
	var lastTime = 0;
	var currentTime = 0;
	var delta;
	//mouvement platine
	var mouv = 2;

	// GRAPHE AUDIO (permet de connecter les noeuds à la source) /////
	this.buildGraph = function () {
		this.bufferSource = this.audioContext.createBufferSource();
		this.bufferSource.buffer = this.decodedSound;

		this.bufferSource.connect(filter);
		filter.connect(filHP);		
		filHP.connect(lowFil);
		lowFil.connect(medFil);
		medFil.connect(trebFil);
		trebFil.connect(gainNode);
		gainNode.connect(analyser);
		analyser.connect(this.audioContext.destination);		
		
		// Progress bar: valeur maximale = temps du morceaux 
		if($('#'+seekbar).attr("max")!=this.getDuration()){
			$('#'+seekbar).attr("max", this.getDuration());	
		}	


		//recuperation du tempo
		var peaks,
		initialThresold = 0.9,
		thresold = initialThresold,
		minThresold = 0.3,
		minPeaks = 30;
		do {
			peaks = getPeaksAtThreshold(this.bufferSource.buffer.getChannelData(0), thresold);
			thresold -= 0.05;
		} while (peaks.length < minPeaks && thresold >= minThresold);
		var intervalCounts = countIntervalsBetweenNearbyPeaks(peaks);
		var tempoCounts = groupNeighborsByTempo(intervalCounts, this.bufferSource.buffer.sampleRate);
		var top = tempoCounts.sort(function(intA, intB) {
			return intB.count - intA.count;
		}).splice(0,5);
		//tempo attribut a objet self
		this.tempo = top[0].tempo;

	};
	
	this.buildGraph2 = function (sens) {
		this.bufferSource = this.audioContext.createBufferSource();
		if (sens > 0) {
			this.bufferSource.buffer = this.decodedSound;
		}
		else if (sens < 0) {
			this.bufferSource.buffer = this.inverseDecodedSound;
		}
			
		this.bufferSource.connect(filter);
		filter.connect(filHP);		
		filHP.connect(lowFil);
		lowFil.connect(medFil);
		medFil.connect(trebFil);
		trebFil.connect(gainNode);
		gainNode.connect(analyser);
		analyser.connect(this.audioContext.destination);		
		
		// Progress bar: valeur maximale = temps du morceaux 
		if($('#'+seekbar).attr("max")!=this.getDuration()){
			$('#'+seekbar).attr("max", this.getDuration());	
		}
	};
		
	
	this.play = function () {
		this.timeStartOnAudioContext = this.audioContext.currentTime;
        // Apres pause donc lastTime a 0 pour ne pas repartir en arriere 
		lastTime=0;
        // appel de la fonction pour le temps de la chanson 
		this.animateTime();
		var playlist;
			if (seekbar === "seekbar") {
				this.bufferSource.playbackRate.setValueAtTime(document.getElementById("speedSoundSlider").value,ctx.currentTime);
			}
			else {
				this.bufferSource.playbackRate.setValueAtTime(document.getElementById("speedSoundSlider2").value,ctx.currentTime);
			}
		this.bufferSource.start(0,this.elapsedTimeSinceStart);
		this.paused = false;	
		
    };
	
	this.stop = function (type) {
		if ( type === "stop") {
			this.elapsedTimeSinceStart = 0;
			this.stopProgressBar();
		}
		if(this.paused == false){
			this.bufferSource.stop();
			this.paused = true;	
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
        	//current time correct en enlevant le temps mort avant le play
            currentTime = this.audioContext.currentTime - this.timeStartOnAudioContext;
            
            // delta 1) le temps "courant" de la musique, moins ce qu'il reste du morceaux
            // delta 2) on multiplie le tout par la vitesse du son en reprenant sa valeur (playbackRate.value)
            var delta = (currentTime - lastTime)*this.speedSound;
                    
            //maj temps click seekBar, si sauvegarde diff de la nouvelle maj
           	if(this.sauvmaj != this.maj){
           		//sauvegarde maj
           		this.sauvmaj = this.maj;
           		//musique au temps du click de la seek bar
           		this.elapsedTimeSinceStart = this.maj;
           		//time start
           		this.timeStartOnAudioContext = this.audioContext.currentTime;
           	}

           	// rajout du temps pour le temps total passe
           	this.elapsedTimeSinceStart += delta;
            // temps precedent 
            lastTime = currentTime;

            // quand on met le son sur stop = this.elapsedTimeSinceStart = 0;
            if (this.elapsedTimeSinceStart > this.getDuration()) {
                this.elapsedTimeSinceStart = 0;

	            //fin de musique on passe a la suivante 
	            if(seekbar === "seekbar"){
	              	document.getElementsByClassName('control2 next')[0].click();
	            }
	            else {
	            	document.getElementsByClassName('control2_2 next')[0].click();
	            }
     		}

     		if(!this.mousedown){
     			platine.style.transform = "rotate("+mouv+"deg)";
     			mouv += 2;
     			if(mouv > 360){
     				mouv= 0;
     			}
     		}
    };

 
    //fonction appelle tout au long de la duree de l'app
    this.draw = function() {
    	if(!this.paused){ // play
			this.progressBar();  
        	document.getElementById("Anim1").className="AnimHead1";
        	document.getElementById("Anim2").className="AnimHead1";
        	document.getElementById("logo").className="displayNone";
        	document.getElementById("logo2").className="display2";
		 } 
		 else { // pause
		 	document.getElementById("Anim1").className="AnimHead";
		 	document.getElementById("Anim2").className="AnimHead";
        	document.getElementById("logo").className="display1";
        	document.getElementById("logo2").className="displayNone";      	
		 }
		//signale une animation et demande de rappeller la fonction draw
	 	requestAnimationFrame(this.draw.bind(this));
	};


	//barre de progression
	this.progressBar = function() {
		this.animateTime();
		//barre progression
		$('#'+seekbar).attr("value", this.elapsedTimeSinceStart);
		//affichage temps
		$('#'+progressTime).text((this.elapsedTimeSinceStart+"").toFormattedTime());

	}

	this.stopProgressBar = function() {
		$('#'+seekbar).attr("value", 0);
		$('#'+progressTime).text((this.elapsedTimeSinceStart+"").toFormattedTime());
		//console.log(this.getDuration());
	}


	//maj temps click seekbar
	this.majTime = function(value) {
		//maj de la valeur de la musique		
		this.maj = value;
		//si en pause alors on appel progress bar qui met tt a j 
		if(this.paused){
			this.progressBar();	
		}
		//si on est en train de jouer on stop puis play
		else {
			this.stop("stop");
			this.buildGraph();
			this.play();
		}

	}

	// Vitesse du son / speed sound
	this.changeSpeed = function(value) {
		if (!this.paused) {
			this.bufferSource.playbackRate.setTargetAtTime(value,ctx.currentTime,0.2);
		}
		this.speedSound = value;
	}

	////////////////////// LIMIT CHARACTERS ///////////////////////
	
	this.limitCharacters = function(){

		// CURRENT SONG 1: Limit les charactères du titre pour ne pas apparaitre en entier
	 	var limit = 35;
        var chars = $("#currentSong").text(); 
        if (chars.length > limit ) {
            var visiblePart = $("<span> "+ chars.substr(0, limit-1) +"</span>");
            var dots = $("<span class='dots'>... </span>");
            var hiddenPart = $("<span class='more'>"+ chars.substr(limit-1) +"</span>");

            $("#currentSong").empty()
                .append(visiblePart)
                .append(dots)
                .append(hiddenPart);
        }
        // CURRENT SONG 2: Limit les charactères du titre pour ne pas apparaitre en entier
		var limit2 = 35;
        var chars2 = $("#currentSong2").text(); 
        if (chars2.length > limit2) {
            var visiblePart2 = $("<span> "+ chars2.substr(0, limit2-1) +"</span>");
            var dots2 = $("<span class='dots'>... </span>");
            var hiddenPart2 = $("<span class='more'>"+ chars2.substr(limit2-1) +"</span>");

            $("#currentSong2").empty()
                .append(visiblePart2)
                .append(dots2)
                .append(hiddenPart2);
        }
	}	


	this.setMouseDown = function (bool) {
		this.mousedown = bool;
	}

	// identifie peaks
	function getPeaksAtThreshold(data, threshold) {
	    var peaksArray = [];
	    var length = data.length;
	    for(var i = 0; i < length;) {
	      if (data[i] > threshold) {
	        peaksArray.push(i);
	        // Skip forward ~ 1/4s to get past this peak.
	        i += 10000;
	      }
	      i++;
	    }
	    return peaksArray;
	}

	// retourne un histogramme des intervalles de peaks
	function countIntervalsBetweenNearbyPeaks(peaks) {
	    var intervalCounts = [];
	    peaks.forEach(function(peak, index) {
		    for(var i = 0; i < 10; i++) {
	    	    var interval = peaks[index + i] - peak;
	        	var foundInterval = intervalCounts.some(function(intervalCount) {
	          		if (intervalCount.interval === interval)
	            		return intervalCount.count++;
	        		});
	        		if (!foundInterval) {
	         			intervalCounts.push({
	            			interval: interval,
	            			count: 1
	          			});
	        		}
	      		}
	    	});
	    return intervalCounts;
	}

	// Function used to return a histogram of tempo candidates.
	function groupNeighborsByTempo(intervalCounts, sampleRate) {
	    var tempoCounts = [];
	    intervalCounts.forEach(function(intervalCount, i) {
	    	if (intervalCount.interval !== 0) {
	        	// Convert an interval to tempo
	        	var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

	        	// Adjust the tempo to fit within the 90-180 BPM range
	        	while (theoreticalTempo < 90) theoreticalTempo *= 2;
	        	while (theoreticalTempo > 180) theoreticalTempo /= 2;

	        	theoreticalTempo = Math.round(theoreticalTempo);
	        	var foundTempo = tempoCounts.some(function(tempoCount) {
	          		if (tempoCount.tempo === theoreticalTempo)
	            		return tempoCount.count += intervalCount.count;
	        	});
	        	if (!foundTempo) {
	          		tempoCounts.push({
	            		tempo: theoreticalTempo,
	            		count: intervalCount.count
	          		});
	        	}
	      	}
	    });
	    return tempoCounts;
	}
}




	
