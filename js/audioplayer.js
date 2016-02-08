////////////////////////////// VARIABLE AUDIO //////////////////////////////
var audio = document.getElementById('audioPlayer');

////////////////////////////// PLAY / PAUSE //////////////////////////////

    function play(idPlayer, control) {
      var player = document.querySelector('#' + idPlayer);
    
      if (player.paused) {
          player.play();
          pButton.className = "";
          pButton.className = "pause";
      } else {
          player.pause(); 
          pButton.className = "";
          pButton.className = "play";
      }
  }

////////////////////////////// STOP //////////////////////////////

  function stop(idPlayer) {
      var player = document.querySelector('#' + idPlayer);
      player.currentTime = 0;
      player.pause();
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


////////////////////////////// VOLUME //////////////////////////////

    $('.muted').click(function () {
        audio.muted = !audio.muted;
        return false;
    });

    //VOLUME BAR
    //volume bar event
    var volumeDrag = false;
    $('.volume').on('mousedown', function (e) {
        volumeDrag = true;
        audio.muted = false;
        $('.sound').removeClass('muted');
        updateVolume(e.pageX);
    });
    $(document).on('mouseup', function (e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });
    $(document).on('mousemove', function (e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });
    var updateVolume = function (x, vol) {
        var volume = $('.volume');
        var percentage;
        //if only volume have specificed
        //then direct update volume
        if (vol) {
            percentage = vol * 100;
        } else {
            var position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        //update volume bar and video volume
        $('.volumeBar').css('width', percentage + '%');
        audio.volume = percentage / 100;

        //change sound icon based on volume
        if (audio.volume == 0) {
            $('.sound').removeClass('sound2').addClass('muted');
        } else if (audio.volume > 0.5) {
            $('.sound').removeClass('muted').addClass('sound2');
        } else {
            $('.sound').removeClass('muted').removeClass('sound2');
        }

    };


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
   
    $("#filename").text(file.name.replace(".mp3",""));

    objectUrl = URL.createObjectURL(file);
    $("#audioPlayer").prop("src", objectUrl);
});

///////////////////////// CHARGER AUDIO + AFFICHER NOM MUSIQUE /////////////////////////

    document.getElementById('mute').addEventListener('click', function (e) {
        e = e || window.event;
        audio.muted = !audio.muted;
        e.preventDefault();
    }, false);
