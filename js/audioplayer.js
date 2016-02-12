////////////////////////////// VARIABLE AUDIO //////////////////////////////
var audio = document.getElementById('audioPlayer');
var ctx;
var playList1 = [];
var gainSlider;
var FilterSample = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
  playing: true
};

window.onload = function init() {
	// To make it work even on browsers like Safari, that still
	// do not recognize the non prefixed version of AudioContext
	var audioContext = window.AudioContext || window.webkitAudioContext;
	// get the AudioContext
	ctx = new audioContext();
	
	// input listener on the gain slider
	gainSlider = document.querySelector('#gainSlider');
	gainSlider.oninput = function(evt){
		playList1[0].changeVolume(evt.target.value);
	};
		
	// imput listener sur freqFilter
	FilterSample = document.querySelector('#FilterSample');
	FilterSample.oninput = function(ett){
		playList1[0].changeFrequency(ett.target.value);
	}; 

};
////////////////////////////// PLAY / PAUSE //////////////////////////////

function play(idPlayer, control) {
    var player = document.querySelector('#' + idPlayer);
    
    if (playList1[0].paused) {
		playList1[0].buildGraph();
		playList1[0].play();
        pButton.className = "";
        pButton.className = "pause";
    } else {
		playList1[0].stop("pause");
        pButton.className = "";
        pButton.className = "play";
    }
    
}

////////////////////////////// STOP //////////////////////////////

function stop(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList1[0].stop("stop");
	pButton.className = "";
    pButton.className = "play";
    
}


////////////////////////////// VOLUME //////////////////////////////

function update(player) {
    var duration = player.duration;    // Durée totale
    var time     = player.currentTime; // Temps écoulé
    var fraction = time / duration;
    var percent  = Math.ceil(fraction * 100);

    var progress = document.querySelector('#progressBar');
    
    progress.style.width = percent + '%';
    /* progress.textContent = percent + '%';*/

    document.querySelector('#progressTime').textContent = formatTime(time);
}

//////////////////////////// EFFET ///////////////////////////////////////
//filtre lowpass
	FilterSample.FiltreLowPass = function (element) {
	  // Clamp the frequency between the minimum value (40 Hz) and half of the
	  // sampling rate.
	  var minValue = 40;
	  var maxValue = context.sampleRate / 2;
	  // Logarithm (base 2) to compute how many octaves fall in the range.
	  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	  // Compute a multiplier from 0 to 1 based on an exponential scale.
	  var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
	  // Get back to the frequency value between min and max.
	  this.filter.frequency.value = maxValue * multiplier;	
	};
	/*
// filtre quality
	FilterSample.FiltreQuality = function FiltreQuality(element) {
	  this.filter.Q.value = element.value * this.QUAL_MUL;
	};*/
	
	
////////////////////////////// TEMPS DE LA MUSIQUE //////////////////////////////

function formatTime(time) {
    var hours = Math.floor(time / 3600);
    var mins  = Math.floor((time % 3600) / 60);
    var secs  = Math.floor(time % 60);
    
    if (secs < 10) {
        secs = "0" + secs;
    }
    
    if (hours) {
        if (mins < 10) {
            mins = "0" + mins;
		}
      
        return hours + ":" + mins + ":" + secs; // hh:mm:ss
    } else {
        return mins + ":" + secs; // mm:ss
    }

}




///////////////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////////////

$("#audioPlayer").on("canplaythrough", function(e){
    var seconds = e.currentTarget.duration;
    var duration = moment.duration(seconds, "seconds");
    
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":" ; }
    
    time = time + duration.minutes() + ":" + duration.seconds();
    $("#duration").text(time);
    
    URL.revokeObjectURL(objectUrl);
});

$("#file").change(function(e){
    var file = e.currentTarget.files[0];
	objectUrl = URL.createObjectURL(file);
	var music = new Music(file.name.replace(".mp3",""), ctx, objectUrl);
	playList1.push(music);
	$("#filename").text(music.name);
    
    $("#audioPlayer").prop("src", objectUrl);
	
	loadSoundUsingAjax(music);
});

function loadSoundUsingAjax(music) {
	var request = new XMLHttpRequest();
  
	request.open('GET', music.url, true);
	// Important: we're loading binary data
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		console.log("Sound loaded");
    
		// Let's decode it. This is also asynchronous
		ctx.decodeAudioData(request.response, function(buffer) {
			console.log("Sound decoded");
			music.decodedSound = buffer;
			// we enable the button
			//playButton.disabled = false;
		}, function(e) {
			console.log("error");});
		};
  
    // send the request. When the file will be loaded,
    // the request.onload callback will be called (above)
	request.send();
}
