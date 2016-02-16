////////////////////////////// VARIABLE AUDIO //////////////////////////////
var audio = document.getElementById('audioPlayer');
var ctx;
var playList1 = [];
var gainSlider;
/*var progressTime = document.querySelector('#progressTime');*/
/*var FilterSample = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
  playing: true
};*/
var filter;

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
		
	// input listener sur FiltreLowPass
	filter = document.querySelector('#filter');
	filter.oninput = function(element){
		playList1[0].lowpass(element.target.value);
	}; 

};
////////////////////////////// PLAY / PAUSE //////////////////////////////

function play(idPlayer, control) {
    var player = document.querySelector('#' + idPlayer);
    
    if (playList1[0].paused) {
		playList1[0].buildGraph();
		playList1[0].play();
        pButton.className = "";
        pButton.className = "control1 pause";
    } else {
		playList1[0].stop("pause");
        pButton.className = "";  
        pButton.className = "control1 play";
    }
    
}

////////////////////////////// STOP //////////////////////////////

function stop(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList1[0].stop("stop");
	pButton.className = "";
    pButton.className = "control1 play";
    
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
			playList1[0].draw();
		}, function(e) {
			console.log("error");});
		};
  
    // send the request. When the file will be loaded,
    // the request.onload callback will be called (above)
	request.send();
}
