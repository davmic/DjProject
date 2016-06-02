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
/*	disto1 = document.getElementById("disto1");
	disto1.onchange = function(evt){
		k = parseFloat(evt.target.value);
		playList1.changeDisto(evt.target.value);
	};*/

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

	// midi init, initialise commands[]
	midiinit();
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

        document.getElementById("barcG1").className="bar-c";	
        document.getElementById("barcG2").className="displayNone";	


    } else {
		playList1.playList[playList1.choix].stop("pause");
        pButton.className = "";  
        pButton.className = "control1 play";

        document.getElementById("song"+playList1.choix).className="hoverClickplay"; 

        document.getElementById("barcG1").className="displayNone";	
        document.getElementById("barcG2").className="bardnone";
    }
 
}

////////////////////////////// STOP //////////////////////////////

function stop(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList1.playList[playList1.choix].stop("stop");
	pButton.className = "";
    pButton.className = "control1 play";

    document.getElementById("song"+playList1.choix).className="hoverClickpause"; 

    document.getElementById("barcG1").className="displayNone";	
    document.getElementById("barcG2").className="bardnone";
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
  	$("#playList").append("<tr><td class='sizeDebTr'><div id=song"+(playList1.playList.length-1) + " class='hoverClickpause' ondblclick='choixMusique("+(playList1.playList.length-1)+")'><i class='fa fa-music' aria-hidden='true'></i><span class='paddSpanSongplaylt'>"+ playList1.playList[playList1.playList.length-1].name+"</span></div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='bpm1_"+(playList1.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='time1_"+(playList1.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='format1_"+(playList1.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='size1_"+(playList1.playList.length-1)+"'> </div></td></tr>");

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

        document.getElementById("barcD1").className="bar-c";	
        document.getElementById("barcD2").className="displayNone";

    } else {
		playList2.playList[playList2.choix].stop("pause");
        pButton2.className = "";  
        pButton2.className = "control2_1 play";

        document.getElementById("song2"+playList2.choix).className="hoverClickplay";

        document.getElementById("barcD1").className="displayNone";	
        document.getElementById("barcD2").className="bardnone"; 
    }

}

////////////////////////////// STOP //////////////////////////////

function stop2(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
    playList2.playList[playList2.choix].stop("stop");
	pButton2.className = "";
    pButton2.className = "control2_1 play";

    document.getElementById("song2"+playList2.choix).className="hoverClickpause"; 

    document.getElementById("barcD1").className="displayNone";	
    document.getElementById("barcD2").className="bardnone"; 
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
  	$("#playList2").append("<tr><td class='sizeDebTr'><div id=song2"+(playList2.playList.length-1) + " class='hoverClickpause' ondblclick='choixMusique2("+(playList2.playList.length-1)+")'><i class='fa fa-music' aria-hidden='true'></i><span class='paddSpanSongplaylt'>"+ playList2.playList[playList2.playList.length-1].name+"</span></div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='bpm2_"+(playList2.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='time2_"+(playList2.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='format2_"+(playList2.playList.length-1)+"'> </div></td><td class='textdivBlcplylt sizeDebtrTD'><div id='size2_"+(playList2.playList.length-1)+"'> </div></td></tr>");

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


function changeCrossFader(value) {
	if(value>2){
		var volume1 = gainSlider.value - (value - 2);
		var volume2 = (gainSlider2.value -  ( 2 - value  ));
		if(volume1<0) volume1 = 0;
		if(volume2>4) volume2 = 4;
		playList1.changeVolume(volume1);
		playList2.changeVolume(volume2);
	}
	else if(value<2){
		var volume1 = (gainSlider.value - ( value - 2));
		var volume2 = gainSlider2.value - (2 - value);
		if(volume1>4) volume1 = 4;
		if(volume2<0) volume2 = 0;
		playList1.changeVolume(volume1);
		playList2.changeVolume(volume2);
	}
	else {
		if (gainSlider.value !== undefined) {
			playList1.changeVolume(gainSlider.value);
			playList2.changeVolume(gainSlider2.value);	
		}
	}
}

// maps a value from [istart, istop] into [ostart, ostop]
function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

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
	midiconnected = true;
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") {
		console.log("name: ", name, "port: ", port, "state: ", state);
		midiconnected = true;
		$('#midicommand').show();
	}
	if (state == "disconnected"){
		console.warn(" MIDI disconnected");
		midiconnected = false;
		$('#midicommand').hide();
	}
}


// attribuer à une commande les données, [command][note][velocity]
function midiCommandSwitch(midicommand, data) {
	var val = 0;
	switch(midicommand) {
		case "playa":
			//playA
			commands[0] = data;
			val = 0;
			break;
		case "playb":
			//playB
			commands[1] = data;
			val = 1;
			break;
		case "pitcha":
			//pitchA
			commands[2] = data;
			val = 2;
			break;
		case "pitchb":
			//pitchB
			commands[3] = data;
			val = 3;
			break;
		case "benda":
			//bendA
			commands[4] = data;
			val = 4;
			break;
		case "bendb":
			//bendB
			commands[5] = data;
			val = 5;
			break;
		case "volumea":
			//volumeA
			commands[6] = data;
			val = 6;
			break;
		case "volumeb":
			//volumeB
			commands[7] = data;
			val = 7;
			break;
		case "stopa":
			//stopA
			commands[8] = data;
			val = 8;
			break;
		case "stopb":
			//stopB
			commands[9] = data;
			val = 9;
			break;
		case "synca":
			//syncA
			commands[10] = data;
			val = 10;
			break;
		case "syncb":
			//syncB
			commands[11] = data;
			val = 11;
			break;
		case "master":
			//master
			commands[12] = data;
			val = 12;
			break;
		case "casque":
			//casque
			commands[13] = data;
			val = 13;
			break;
		case "speeda":
			//speeda
			commands[14] = data;
			val = 14;
			break;
		case "speedb":
			//speedb
			commands[15] = data;
			val = 15;
			break;
		case "cross":
			//cross
			commands[16] = data;
			val = 16;
			break;
		case "casquea":
			//casquea
			commands[17] = data;
			val = 17;
			break;
		case "casqueb":
			//casqueb
			commands[18] = data;
			val = 18;
			break;
		case "wheela":
			//wheela
			commands[19] = data;
			val = 19;
			break;
		case "wheelb":
			//wheelb
			commands[20] = data;
			val = 20;
			break;
		case "loada":
			//loada
			commands[21] = data;
			val = 21;
			break;
		case "loadb":
			//loadb
			commands[22] = data;
			val = 22;
			break;
		case "back":
			//back
			commands[23] = data;
			val = 23;
			break;
		case "enter":
			//enter
			commands[24] = data;
			val = 24;
			break;
		case "browse":
			//browse
			commands[25] = data;
			val = 25;
			break;
	}
	for(i = 0; i < commands.length; i++) {
		// si doublon alors on enleve les data du tableau commands
		if (data[0] == commands[i][0] && data[1] == commands[i][1]) {
			if ( val != i) {
				commands[i][0] = 0;
				commands[i][1] = 0;
			}
		}
	}
}
//flag
var midiconnected = false;
var midilearn = false;
var flagset = 1;
// commands
var commands = [];


function midiinit() {
var playA = [144, 59, 127];
var playB = [144, 66, 127];
var pitchA = [144, 68, 127];
var pitchB = [144, 70, 127];
var bendA = [144, 67, 127];
var bendB = [144, 69, 127];
var volumeA = [176, 8, 127];
var volumeB = [176, 9, 127];
var stopA = [144, 51, 127];
var stopB = [144, 60, 127];
var syncA = [144, 64, 127];
var syncB = [144, 71, 127];
var master = [176, 23, 1];
var casque = [176, 11, 1];
var speedA = [176, 13, 127];
var speedB = [176, 14, 127];
var cross = [176, 10, 127];
var casqueA = [144, 101, 127];
var casqueB = [144, 102, 127];
var wheelA = [176, 25, 127];
var wheelB = [176, 24, 127];
var loadA = [144, 75, 127];
var loadB = [144, 52, 127];
var back = [144, 89, 127];
var enter = [144, 90, 127];
var browse = [176, 26, 1];

commands[0] = playA;
commands[1] = playB;
commands[2] = pitchA;
commands[3] = pitchB;
commands[4] = bendA;
commands[5] = bendB;
commands[6] = volumeA;
commands[7] = volumeB;
commands[8] = stopA;
commands[9] = stopB;
commands[10] = syncA;
commands[11] = syncB;
commands[12] = master;
commands[13] = casque;
commands[14] = speedA;
commands[15] = speedB;
commands[16] = cross;
commands[17] = casqueA;
commands[18] = casqueB;
commands[19] = wheelA;
commands[20] = wheelB;
commands[21] = loadA;
commands[22] = loadB;
commands[23] = back;
commands[24] = enter;
commands[25] = browse;
}


function onMIDImessage(messageData) {
	var data = messageData.data;
	var value;
	//console.log(data);
	// channel/command du message
	channel = data[0] & 0xf0;
	note = data[1];
	velocity = data[2];
	if (midilearn == true) {
		//var midicommand à récupérer
		var midicommand = $('#midicommand').val();
		//console.log("midicommand " + midicommand);
		if (data [0] != 128 && data[1] != 26) {
			midiCommandSwitch(midicommand, data);
		}
	}
	for(i = 0; i < commands.length; i++) {
		if(data[0] == commands[i][0] && data[1] == commands[i][1]) {
			switch(i) {
				case 0:
					//playA
					play('audioPlayer', $('#pButton'));
					break;
				case 1:
					//playB
					play2('audioPlayer2', $('#pButton2'));
					break;
				case 2:
					//pitchA
					previous();
					break;
				case 3:
					//pitchB
					previous2();
					break;
				case 4:
					//bendA
					next();
					break;
				case 5:
					//bendB
					next2();
					break;
				case 6:
					//volumeA
					value = map(velocity, 0 ,127 ,0 ,4);
					document.querySelector('#gainSlider').setValue(value,true);
					playList1.changeVolume(value);
					break;
				case 7:
					//volumeB
					value = map(velocity, 0 ,127 ,0 ,4);
					document.querySelector('#gainSlider2').setValue(value,true);
					playList1.changeVolume(value);
					break;
				case 8:
					//stopA
					stop('audioPlayer');
					break;
				case 9:
					//stopB
					stop2('audioPlayer2');
					break;
				case 10:
					//syncA
					sync();
					break;
				case 11:
					//syncB
					sync();
					break;
				case 12:
					//master
					if (flagset == 1) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#trebEq').setValue(value,true);
						playList1.volumeTrebEq(value);
					}
					else if (flagset == 2) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#medEq').setValue(value,true);
						playList1.volumeMedEq(value);
					}
					else if (flagset == 3) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#lowEq').setValue(value,true);
						playList1.volumeLowEq(value);
					}
					else if (flagset == 4) {
						value = map(velocity, 0 ,127 ,300 ,5000);
						document.querySelector('#filterLP').setValue(value,true);
						playList1.filterLowPass(value);
					}
					else if (flagset == 5) {
						value = map(velocity, 0 ,127 ,-5000 ,-300);
						document.querySelector('#filterHP').setValue(value,true);
						playList1.filterHighPass(value);
					}
					break;
				case 13:
					//casque
					if (flagset == 1) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#trebEq2').setValue(value,true);
						playList2.volumeTrebEq(value);
					}
					else if (flagset == 2) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#medEq2').setValue(value,true);
						playList2.volumeMedEq(value);
					}
					else if (flagset == 3) {
						value = map(velocity, 0 ,127 ,-40 ,30);
						document.querySelector('#lowEq2').setValue(value,true);
						playList2.volumeLowEq(value);
					}
					else if (flagset == 4) {
						value = map(velocity, 0 ,127 ,300 ,5000);
						document.querySelector('#filterLP2').setValue(value,true);
						playList2.filterLowPass(value);
					}
					else if (flagset == 5) {
						value = map(velocity, 0 ,127 ,-5000 ,-300);
						document.querySelector('#filterHP2').setValue(value,true);
						playList2.filterHighPass(value);
					}
					break;
				case 14:
					//speedA
					value = map(velocity, 0 ,127 ,0 ,4);
					document.querySelector('#speedSoundSlider').setValue(value,true);
					playList1.changeSpeed(value);
					break;
				case 15:
					//speedB
					value = map(velocity, 0 ,127 ,0 ,4);
					document.querySelector('#speedSoundSlider2').setValue(value,true);
					playList2.changeSpeed(value);
					break;
				case 16:
					//cross
					value = map(velocity, 0 ,127 ,0 ,4);
					document.querySelector('#crossFader').setValue(value,true);
					changeCrossFader(value);
					break;
				case 17:
					//casqueA
					break;
				case 18:
					//casqueB
					break;
				case 19:
					//wheelA
					playList1.changePlatineMIDI(velocity);
					break;
				case 20:
					//wheelB
					playList2.changePlatineMIDI(velocity);
					break;
				case 21:
					//loadA
					break;
				case 22:
					//loadB
					break;
				case 23:
					//back
					resetAll();
					break;
				case 24:
					//enter
					break;
				case 25:
					//browse
					if(velocity == 127) {
						if (flagset < 5) {
							flagset++;
						}
						else {
							flagset = 1;
						}
						midilearn = false;
						$('#midicommand').hide();
						}
					else if (velocity == 1 && midiconnected == true) {
						midilearn = true;
						$('#midicommand').show();
					}
					break;
				}
			}
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
	document.querySelector('#gainSlider').setValue(1,true);
	document.querySelector('#gainSlider2').setValue(1,true);
	
	playList1.changeSpeed(1);
	playList2.changeSpeed(1);
	document.querySelector('#speedSoundSlider').setValue(1,true);
	document.querySelector('#speedSoundSlider2').setValue(1,true);
	playList1.filterLowPass(5000);
	playList2.filterLowPass(5000);
	document.querySelector('#filterLP').setValue(5000,true);
	document.querySelector('#filterLP2').setValue(5000,true);
	playList1.filterHighPass(-300);
	playList2.filterHighPass(-300);
	document.querySelector('#filterHP').setValue(-300,true);
	document.querySelector('#filterHP2').setValue(-300,true);
	document.querySelector('#crossFader').setValue(2,true);
	playList1.volumeLowEq(0);
	playList2.volumeLowEq(0);
	document.querySelector('#lowEq').setValue(0,true);
	document.querySelector('#lowEq2').setValue(0,true);
	playList1.volumeMedEq(0);
	playList2.volumeMedEq(0);
	document.querySelector('#medEq').setValue(0,true);
	document.querySelector('#medEq2').setValue(0,true);
	
	playList1.volumeTrebEq(0);
	playList2.volumeTrebEq(0);
	document.querySelector('#trebEq').setValue(0,true);
	document.querySelector('#trebEq2').setValue(0,true);
}
