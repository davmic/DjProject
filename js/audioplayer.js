////////////////////////////// VARIABLE AUDIO //////////////////////////////
var audio = document.getElementById('audioPlayer');
var ctx;
var playList1 = new PlayList();
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
		playList1.playList[playList1.choix].changeVolume(evt.target.value);
	};
	
	// input listener sur le speedSound slider
	speedSoundlider = document.querySelector('#speedSoundSlider');
	speedSoundSlider.oninput = function(evt){
		playList1.playList[playList1.choix].changeSpeed(evt.target.value);
	};
	
	// input listener sur FiltreLowPass
	filter = document.querySelector('#filter');
	filter.oninput = function(element){
		playList1.playList[playList1.choix].lowpass(element.target.value);
	}; 

};
////////////////////////////// PLAY / PAUSE //////////////////////////////

function play(idPlayer, control) {

    
    var player = document.querySelector('#' + idPlayer);
    
    if (playList1.playList[playList1.choix].paused) {
		playList1.playList[playList1.choix].buildGraph();
		playList1.playList[playList1.choix].play();
        pButton.className = "";
        pButton.className = "control1 pause";

        document.getElementById("song"+playList1.choix).className="hoverClickplay";

    } else {
		playList1.playList[playList1.choix].stop("pause");
        pButton.className = "";  
        pButton.className = "control1 play";

        document.getElementById("song"+playList1.choix).className="hoverClickplay";
    }


    
}

////////////////////////////// STOP //////////////////////////////

function stop(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList1.playList[playList1.choix].stop("stop");
	pButton.className = "";
    pButton.className = "control1 play";

    document.getElementById("song"+playList1.choix).className="hoverClickpause";
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

	
/////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////

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
    playList1.change(e);
    //action au double click
    $("#playList").append("<div id=song"+(playList1.playList.length-1)+" class='hoverClickpause' ondblclick='choixMusique("+(playList1.playList.length-1)+")'>"+ playList1.playList[playList1.playList.length-1].name+"</div><br/>");

});


///////////////////////// CHOIX AUDIO /////////////////////////
//click sur la playList
function choixMusique(i){
	playList1.changeChoix(i);
}
//next
function next(){
	playList1.nextSong();

}

//previous
function previous(){
	playList1.previousSong();
}

