////////////////////////////// VARIABLE AUDIO //////////////////////////////
var playList1;
var playList2;
var gainSlider;
var gainSlider2;
window.onload = function init() {

	// To make it work even on browsers like Safari, that still
	// do not recognize the non prefixed version of AudioContext
	var audioContext = window.AudioContext || window.webkitAudioContext;
	
	// get the AudioContext
	ctx = new audioContext();
	
	// on instancie les playlists
	playList1 = new PlayList(ctx,"audioPlayer","seekbar","progressTime");
	// input listener on the gain slider
	gainSlider = document.getElementById("gainSlider");
	gainSlider.onchange = function(evt){
		playList1.changeVolume(evt.target.value);
	};
	
	// input listener sur FiltreLowPass
	filterLP = document.getElementById("filterLP");
	filterLP.onchange = function(evt){
		playList1.filterLowPass(evt.target.value);
	}; 
	// input listener sur FiltreHighPass
	filterHP = document.getElementById("filterHP");
	filterHP.onchange = function(evt){
		playList1.filterHighPass(evt.target.value);
	}; 

	// input listener sur lowEq
	lowEq = document.getElementById("lowEq");
	lowEq.onchange = function(evt){
		playList1.volumeLowEq(evt.target.value);
	}; 
	
	// input listener sur medEq
	medEq = document.getElementById("medEq");
	medEq.onchange = function(evt){
		playList1.volumeMedEq(evt.target.value);
	}; 
	// input listener sur trebEq
	trebEq = document.getElementById("trebEq");
	trebEq.onchange = function(evt){
		playList1.volumeTrebEq(evt.target.value);
	}; 

	// input listener sur le speedSound slider
	speedSoundSlider = document.getElementById("speedSoundSlider");
	speedSoundSlider.onchange = function(evt){
		playList1.changeSpeed(evt.target.value);
	};
		// input sur distorsion 1
	disto1 = document.getElementById("disto1");
	disto1.onchange = function(evt){
		k = parseFloat(evt.target.value);
		playList1.changeDisto(evt.target.value);
	};

	// input listener sur la platine
	platine1 = document.getElementById("platine1");
	playList1.platine = platine1;
	playList1.platine.ondragstart = function() {return false};
	playList1.platine.onmousemove = function(evt) {
		playList1.changePlatine(evt);
	};
	playList1.platine.onmousedown = function() {
		playList1.mouseDown();
	};
	playList1.platine.onmouseup = function() {
		playList1.mouseUp();
	};
	
	// To make it work even on browsers like Safari, that still
	// do not recognize the non prefixed version of AudioContext
	var audioContext2 = window.AudioContext || window.webkitAudioContext;
	
	// get the AudioContext
	ctx2 = new audioContext2();
	
	// on instancie les playlists
	playList2 = new PlayList(ctx2,"audioPlayer2","seekbar2","progressTime2");
	// input listener on the gain slider
	gainSlider2 = document.getElementById("gainSlider2");
	gainSlider2.onchange = function(evt){
		playList2.changeVolume(evt.target.value);
	};
	
	// input listener sur FiltreLowPass
	filterLP2 = document.getElementById("filterLP2");
	filterLP2.onchange = function(evt){
		playList2.filterLowPass(evt.target.value);
	}; 
	// input listener sur FiltreHighPass
	filterHP2 = document.getElementById("filterHP2");
	filterHP2.onchange = function(evt){
		playList2.filterHighPass(evt.target.value);
	}; 

	// input listener sur lowEq
	lowEq2 = document.getElementById("lowEq2");
	lowEq2.onchange = function(evt){
		playList2.volumeLowEq(evt.target.value);
	}; 
	// input listener sur medEq
	medEq2 = document.getElementById("medEq2");
	medEq2.onchange = function(evt){
		playList2.volumeMedEq(evt.target.value);
	}; 
	// input listener sur trebEq
	trebEq2 = document.getElementById("trebEq2");
	trebEq2.onchange = function(evt){
		playList2.volumeTrebEq(evt.target.value);
	}; 

	// input listener sur le speedSound slider
	speedSoundSlider2 = document.getElementById("speedSoundSlider2");
	speedSoundSlider2.onchange = function(evt){
		playList2.changeSpeed(evt.target.value);
	};
	
	// input listener sur la platine
	platine2 = document.getElementById("platine2");
	playList2.platine = platine2;
	playList2.platine.ondragstart = function() {return false};
	playList2.platine.onmousemove = function(evt) {
		playList2.changePlatine(evt);
	};
	playList2.platine.onmousedown = function() {
		playList2.mouseDown();
	};
	playList2.platine.onmouseup = function() {
		playList2.mouseUp();
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

////////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////

$("#file").change(function(e){
    playList1.change(e,"audioPlayer");
    //action au double click
  	$("#playList").append("<div id=song"+(playList1.playList.length-1)+" class='hoverClickpause' ondblclick='choixMusique("+(playList1.playList.length-1)+")'>"+ playList1.playList[playList1.playList.length-1].name+"</div><div id='bpm'>bpm: </div><div id='time1_"+(playList1.playList.length-1)+"'>temps:</div><div>format:</div><br/>");

    if(playList1.playList.length===1){
    	changeCurrentSong(1);
    }
});

///////////////////////// CHOIX AUDIO /////////////////////////

//click sur la playList
function choixMusique(i){
	playList1.changeChoix(i);
	changeCurrentSong(1);
}
//next
function next(){
	playList1.nextSong();
	changeCurrentSong(1);
}

//previous
function previous(){
	playList1.previousSong();
	changeCurrentSong(1);
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

        document.getElementById("song2"+playList2.choix).className="hoverClickplay";

    } else {
		playList2.playList[playList2.choix].stop("pause");
        pButton2.className = "";  
        pButton2.className = "control2_1 play";

        document.getElementById("song2"+playList2.choix).className="hoverClickplay";
    }

}

////////////////////////////// STOP //////////////////////////////

function stop2(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList2.playList[playList2.choix].stop("stop");
	pButton2.className = "";
    pButton2.className = "control2_1 play";

    document.getElementById("song2"+playList2.choix).className="hoverClickpause"; 
}

////////////////////////////// VOLUME /////////////////////////////

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
    $("#playList2").append("<div id=song2"+(playList2.playList.length-1)+" class='hoverClickpause' ondblclick='choixMusique2("+(playList2.playList.length-1)+")'>"+ playList2.playList[playList2.playList.length-1].name+"</div><div id='bpm2'>bpm: </div><div id='time2_"+(playList2.playList.length-1)+"'>temps:</div><div id='form2'>format:</div><br/>");

    if(playList2.playList.length===1){
    	changeCurrentSong(2);
    }
});
/////////////////// AFFICHER LE SPECTRE AUDIO ////////////////////////////
/*$("#file2").change(function(){
	draw();
});*/



///////////////////////// CHOIX AUDIO /////////////////////////

//click sur la playList
function choixMusique2(i){
	playList2.changeChoix(i);
	changeCurrentSong(2);
}
//next
function next2(){
	playList2.nextSong();
	changeCurrentSong(2);
}

//previous
function previous2(){
	playList2.previousSong();
	changeCurrentSong(2);
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





/////////////// Création CROSSFADER /////////////////
var crossFader;
//recup element
crossFader = document.getElementById("crossFader");
//qd on bouge le crossFader
crossFader.onchange = function(evt){
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
		if (gainSlider.value !== undefined) {
			playList1.changeVolume(gainSlider.value);
			playList2.changeVolume(gainSlider2.value);	
		}
	}
		
};



/////////////////// CHANGE CURRENT SONG ////////////////////////////
function changeCurrentSong(i){
	if(i==1){
		var c1 = document.getElementById("currentSong"); 
		c1.innerHTML = playList1.playList[playList1.choix].name;
		playList1.playList[playList1.choix].limitCharacters();
	}
	else if(i==2){
		var c2 = document.getElementById("currentSong2"); 
		c2.innerHTML = playList2.playList[playList2.choix].name;
		playList2.playList[playList2.choix].limitCharacters();
	}
};


// Gestion MIDI //

// On verifie que le navigateur supporte l'API WEBMIDI
if (navigator.requestMIDIAccess) {
	// demande d'accès midi au navigateur, si réussi renvoie à la fonction onMIDISucess , sinon onMIDIFailure
	navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
} else {
	console.warn("No MIDI support in your browser")
}

// FUNCTION ON SUCCESS
function onMIDISuccess(midiData) {
	// MIDI data, inputs, outputs, sysex status
	var midi = midiData;
	var allInputs = midi.inputs.values();
	// Ecoute des inputs MIDI
	for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
		// Quand une valeur MIDI est recu on appelle onMIDIMessage
		input.value.onmidimessage = onMIDImessage;
		// Affiche les informations sur l'input
		listInputs(input);
	}
	// Quand un changement est detecte on appelle onStateChange
	midi.onstatechange = onStateChange;
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name: ", name, "port: ", port, "state: ", state);
	if (state == "disconnected") console.warn(" MIDI disconnected");	
}

function onMIDImessage(messageData) {
	console.log(messageData.data);
	var data = messageData.data;
	// channel/command du message
	channel = data[0] & 0xf0;
	note = data[1];
	velocity = data[2];
	switch(channel) {
		case 144 :
			//Play Button A
			if(note == 59) {
				console.log("Play Button A");
				play('audioPlayer', $('#pButton'));
			}
			//Play Button B
			else if (note == 66) {
				console.log("Play Button B");
				play2('audioPlayer2', $('#pButton2'));
			}
			break;
		case 176 :
			//Wheel A
			if(note == 25) {
				console.log("Wheel A");
			}
			//Wheel B
			else if (note == 24) {
				console.log("Wheel B");
			}
			//Volume A
			else if (note == 8) {
				console.log("Volume A");
				$('#gainSlider').val(velocity/32);
				playList1.changeVolume(velocity/32);
			}
			//Volume B
			else if (note == 11) {
				console.log("Volume B");
				$('#gainSlider2').val(velocity/32);
				playList2.changeVolume(velocity/32);
			}
			//Crossfader
			else if (note == 10) {
				console.log("CrossFader");
				$('#crossFader').val(velocity/32);
			}
			//Volume Master
			else if (note == 23) {
				$('#gainSlider').val(velocity/32);
				$('#gainSlider2').val(velocity/32);
				playList1.changeVolume(velocity/32);
				playList2.changeVolume(velocity/32);
			}
			break;
	}
}

// ON FAILURE
function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}




function sync(){
	if (playList2.playList[playList2.choix].paused && !playList1.playList[playList1.choix].paused ) {
		//play de la 2e musique
		//playList2.playList[playList2.choix].buildGraph();
				//volume a 0
		playList2.changeVolume(0);
		//playList2.playList[playList2.choix].play();
		playList2.nextSong();
		//changer le titre
		changeCurrentSong(2)
        pButton2.className = "";
        //changement affichage boutton
        pButton2.className = "control2_1 pause";
        document.getElementById("song2"+playList2.choix).className="hoverClickplay";
			
        //tempo 
        var tempo1 = playList1.playList[playList1.choix].tempo;	
       

        //tempo 
        var tempo2 = playList2.playList[playList2.choix].tempo;	
       
        //difference bpm pour vitesse
        var diff = calculDiff(tempo1,tempo2);

        //adapte la vitesse par rapport a l'autre chanson (si vitesse change)
        diff += vitesseDiff(playList1.speedSound);
        playList2.changeSpeed(diff);

		setTimeout(function() {
     			baisseEtAugmente(gainSlider.value,0,1);
	 	}, 100);
	 }


	if (playList1.playList[playList1.choix].paused && !playList2.playList[playList2.choix].paused ) {
		//play de la 2e musique
		//playList1.playList[playList2.choix].buildGraph();
				//volume a 0
		playList1.changeVolume(0);
		//playList1.playList[playList1.choix].play();
		playList1.nextSong();
		changeCurrentSong(1)
        pButton.className = "";
        //changement affichage boutton
        pButton.className = "control1 pause";
        document.getElementById("song"+playList1.choix).className="hoverClickplay";
			
        //tempo 
        var tempo1 = playList1.playList[playList1.choix].tempo;	
       

        //tempo 
        var tempo2 = playList2.playList[playList2.choix].tempo;	
       
        //difference bpm pour vitesse
        var diff = calculDiff(tempo2,tempo1);
        //adapte la vitesse par rapport a l'autre chanson (si vitesse change)
        diff += vitesseDiff(playList2.speedSound);
        playList1.changeSpeed(diff);
		// 	var source = audioCtx.createBufferSource();
		// source.playbackRate.value = 1.25; 


		setTimeout(function() {
    			baisseEtAugmente(gainSlider.value,0,2);
		}, 100);
	}




}



function baisseEtAugmente(i,j,playL){
	//baisse le volume de la première musique et augmente celle de la 2e
	i-= 0.01;
	j+= 0.01;
	//console.log("test1: "+ i);
	if(playL == 1){
		playList1.changeVolume(i);
		playList2.changeVolume(j);
	}
	else {
		playList1.changeVolume(j);
		playList2.changeVolume(i);
	}
	
	//tant que le son de la première superieur a 0
	if(i>0.00){
		setTimeout(function() {
    			baisseEtAugmente(i,j,playL);
		}, 100);
	}
	//quand son egal 0 alors pause 
	else  {
		if(playL == 1){
			//musique a 0
			playList1.playList[playList1.choix].stop("stop");
	        pButton.className = "";  
	        pButton.className = "control1 play";
	        playList1.changeVolume(1);
	        document.getElementById("song"+playList1.choix).className="hoverClickplay"; 
    	}
    	else {
    		//musique a 0
			playList2.playList[playList2.choix].stop("stop");
	        pButton2.className = "";  
	        pButton2.className = "control2_1 play";
	        playList2.changeVolume(j);
	        document.getElementById("song2"+playList1.choix).className="hoverClickplay"; 
    	}
	}
}

//calcul pourcentage diff entre les 2 tempos
function calculDiff(tempo1,tempo2){
	var calcul = 1;
	if(tempo1 > tempo2){
		var p = (100 * tempo2)/tempo1;
		calcul += (((100-p)/100));
	}

	else if (tempo1 < tempo2){
		var p = (100 * tempo1)/tempo2;
		calcul -=  ((100-p)/100); 
	}
	return calcul;
}

function vitesseDiff(vitesse){
	vitesse -= 1;
	return vitesse;
}


// Peut fonctionner qu'avec chargement des deux playlists

function resetAll() {
	playList1.changeVolume(1);
	playList2.changeVolume(1);

	playList1.changeSpeed(1);
	playList2.changeSpeed(1);

	playList1.filterLowPass(5000);
	playList2.filterLowPass(5000);

	playList1.volumeLowEq(0);
	playList2.volumeLowEq(0);

	playList1.volumeMedEq(0);
	playList2.volumeMedEq(0);

	playList1.volumeTrebEq(0);
	playList2.volumeTrebEq(0);
}