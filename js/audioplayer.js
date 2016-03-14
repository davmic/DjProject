////////////////////////////// VARIABLE AUDIO //////////////////////////////
var playList1;

window.onload = function init() {

	// To make it work even on browsers like Safari, that still
	// do not recognize the non prefixed version of AudioContext
	var audioContext = window.AudioContext || window.webkitAudioContext;
	
	// get the AudioContext
	ctx = new audioContext();
	
	// on instancie les playlists
	playList1 = new PlayList(ctx,"audioPlayer","seekbar","progressTime");
	// input listener on the gain slider
	var gainSlider;
	gainSlider = document.getElementById("gainSlider");
	gainSlider.oninput = function(evt){
		playList1.changeVolume(evt.target.value);
	};
	
	// input listener sur FiltreLowPass
	filterLP = document.getElementById("filterLP");
	filterLP.oninput = function(evt){
		playList1.filterLowPass(evt.target.value);
	}; 

	// input listener sur lowEq
	lowEq = document.getElementById("lowEq");
	lowEq.oninput = function(evt){
		playList1.volumeLowEq(evt.target.value);
	}; 
	// input listener sur medEq
	medEq = document.getElementById("medEq");
	medEq.oninput = function(evt){
		playList1.volumeMedEq(evt.target.value);
	}; 
	// input listener sur trebEq
	trebEq = document.getElementById("trebEq");
	trebEq.oninput = function(evt){
		playList1.volumeTrebEq(evt.target.value);
	}; 

	// input listener sur le speedSound slider
	speedSoundlider = document.getElementById("speedSoundSlider");
	speedSoundSlider.oninput = function(evt){
		playList1.changeSpeed(evt.target.value);
	};


	// To make it work even on browsers like Safari, that still
	// do not recognize the non prefixed version of AudioContext
	var audioContext2 = window.AudioContext || window.webkitAudioContext;
	
	// get the AudioContext
	ctx2 = new audioContext2();
	
	// on instancie les playlists
	playList2 = new PlayList(ctx2,"audioPlayer2","seekbar2","progressTime2");
	// input listener on the gain slider
	var gainSlider2;
	gainSlider2 = document.getElementById("gainSlider2");
	gainSlider2.oninput = function(evt){
		playList2.changeVolume(evt.target.value);
	};
	
	// input listener sur FiltreLowPass
	filterLP2 = document.getElementById("filterLP2");
	filterLP2.oninput = function(evt){
		playList2.filterLowPass(evt.target.value);
	}; 

	// input listener sur lowEq
	lowEq2 = document.getElementById("lowEq2");
	lowEq2.oninput = function(evt){
		playList2.volumeLowEq(evt.target.value);
	}; 
	// input listener sur medEq
	medEq2 = document.getElementById("medEq2");
	medEq2.oninput = function(evt){
		playList2.volumeMedEq(evt.target.value);
	}; 
	// input listener sur trebEq
	trebEq2 = document.getElementById("trebEq2");
	trebEq2.oninput = function(evt){
		playList2.volumeTrebEq(evt.target.value);
	}; 

	// input listener sur le speedSound slider
	speedSoundlider2 = document.getElementById("speedSoundSlider2");
	speedSoundSlider2.oninput = function(evt){
		playList2.changeSpeed(evt.target.value);
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

        /*document.getElementById("song"+playList1.choix).className="hoverClickplay";*/

    } else {
		playList1.playList[playList1.choix].stop("pause");
        pButton.className = "";  
        pButton.className = "control1 play";

        /*document.getElementById("song"+playList1.choix).className="hoverClickplay";*/
    }


 
}

////////////////////////////// STOP //////////////////////////////

function stop(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList1.playList[playList1.choix].stop("stop");
	pButton.className = "";
    pButton.className = "control1 play";

    /*document.getElementById("song"+playList1.choix).className="hoverClickpause";*/
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

////////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////

$("#file").change(function(e){
    playList1.change(e,"audioPlayer");
    //action au double click
    $("#playList").append("<div id=song"+(playList1.playList.length-1)+" ondblclick='choixMusique("+(playList1.playList.length-1)+")'>"+ playList1.playList[playList1.playList.length-1].name+"</div>");

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

///////////////////////// BARRE DE PROGRESSION CLIQUEABLE /////////////////////////

$('#seekbar').click(function(e){
	console.log("taille "  + e.pageX);
    var time = ((e.pageX - this.offsetLeft) * this.max)/this.offsetWidth;
    playList1.playList[playList1.choix].majTime(time);
    /*
    Enlever la taille des border pour bien calculer la valeur de la seekBar lors du click 
    Faire le test avec le time avec traitement dans music.js , animateTime, essayer de bien faire 
    */

});



////////////////////////////// PLAY / PAUSE //////////////////////////////

function play2(idPlayer, control) {

    
    var player2 = document.querySelector('#' + idPlayer);
    
    if (playList2.playList[playList2.choix].paused) {
		playList2.playList[playList2.choix].buildGraph();
		playList2.playList[playList2.choix].play();
        pButton2.className = "";
        pButton2.className = "control2_1 pause";
    } else {
		playList2.playList[playList2.choix].stop("pause");
        pButton2.className = "";  
        pButton2.className = "control2_1 play";
    }

}

////////////////////////////// STOP //////////////////////////////

function stop2(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList2.playList[playList2.choix].stop("stop");
	pButton2.className = "";
    pButton2.className = "control2_1 play";
}

////////////////////////////// VOLUME //////////////////////////////

function update2(player) {
    var duration = player.duration;    // Durée totale
    var time     = player.currentTime; // Temps écoulé
    var fraction = time / duration;
    var percent  = Math.ceil(fraction * 100);

    var progress = document.querySelector('#progressBar2');
    
    progress.style.width = percent + '%';
    /* progress.textContent = percent + '%';*/

    document.querySelector('#progressTime2').textContent = formatTime(time);
}

////////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////

$("#file2").change(function(e){
    playList2.change(e,audioPlayer2);
    //action au double click
    $("#playList2").append("<div id=song"+(playList2.playList.length-1)+" ondblclick='choixMusique("+(playList2.playList.length-1)+")'>"+ playList2.playList[playList2.playList.length-1].name+"</div>");

});

///////////////////////// CHOIX AUDIO /////////////////////////

//click sur la playList
function choixMusique2(i){
	playList2.changeChoix(i);
}
//next
function next2(){
	playList2.nextSong();

}

//previous
function previous2(){
	playList2.previousSong();
}

///////////////////////// BARRE DE PROGRESSION CLIQUEABLE /////////////////////////

$('#seekbar2').click(function(e){
    var $div = $(e.target);
	var offset = $div.offset();
    var time = ((e.pageX -  offset.left) * this.max)/this.offsetWidth;
    playList2.playList[playList2.choix].majTime(time);
    /*
    Enlever la taille des border pour bien calculer la valeur de la seekBar lors du click 
    Faire le test avec le time avec traitement dans music.js , animateTime, essayer de bien faire 
    */

});





	/////////////// Création crossFader/////////////////
	var crossFader;
	//recup element
	crossFader = document.getElementById("crossFader");
	//qd on bouge le crossFader
	crossFader.oninput = function(evt){
		//si superieur a 2 , playlist 2 avantage
		if(crossFader.value>2){
			//soustrait au volume la valeur d'ajout du crossFader (-2 puisque valeur de comparaison)
			var volume1 = gainSlider.value - (crossFader.value - 2);
			//passer par une valeur negative pour pouvoir faire addition ( - par - ), evite concatenation string
			var volume2 = (gainSlider2.value -  ( 2 - crossFader.value  ));
			//si max ou min atteint alors pour eviter les erreurs attribue a max ou min 
			if(volume1<0) volume1 = 0;
			if(volume2>4) volume2 = 4;
			//changement de volume
			playList1.changeVolume(volume1);
			playList2.changeVolume(volume2);
		}
		//si inferieur a 2, avantage playlist1
		else if(crossFader.value<2){
			//passer par une valeur negative pour pouvoir faire addition ( - par - ), evite concatenation string
			var volume1 = (gainSlider.value - ( crossFader.value - 2));
			//soustrait au volume de la deuxieme playList la valeur d'ajout du crossFader
			var volume2 = gainSlider2.value - (2 - crossFader.value);
			if(volume1>4) volume1 = 4;
			if(volume2<0) volume2 = 0;
			//changement de volume
			playList1.changeVolume(volume1);
			playList2.changeVolume(volume2);
		}
		//si equilibre alors valeur de depart remisent 
		else {
			playList1.changeVolume(gainSlider.value);
			playList2.changeVolume(gainSlider2.value);	
		}
			
	};

	///////////////////FIN crossFader////////////////////////////