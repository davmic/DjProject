<script type="text/javascript">
    var message="";
    var log=[];
    var knobs = document.getElementsByTagName('webaudio-knob');
    for(var i = 0; i < knobs.length; i++)
        knobs[i].addEventListener("change",Dump,false);
    var sliders = document.getElementsByTagName('webaudio-slider');
    for(var i = 0; i < sliders.length; i++)
        sliders[i].addEventListener("change",Dump,false);
    var switches = document.getElementsByTagName('webaudio-switch');
    for(var i = 0; i < switches.length; i++) {
        switches[i].addEventListener("change",Dump,false);
    }
    var key=document.getElementById("key");
    key.addEventListener('change',Dump,false);
    key.addEventListener('note',Dump,false);
    var key2=document.getElementById("key2");

    function Dump(e) {
        var str="";
        if(e.target.id=="key") {
            key2.setNote(e.note[0],e.note[1]);
            str=e.type + " : " + e.target.id + " : [" + e.note + "] ";
        }
        else
            str=e.type + " : " + e.target.id + " : " + e.target.value + " ";
        console.log(str);
        log.unshift(str);
        log.length=20;
        str="";
        for(var i=19;i>=0;--i) {
            if(log[i])
                str+=log[i]+"<br/>";
        }
        var evview=document.getElementById("events");
        evview.innerHTML=str;
        evview.scrollTop=evview.scrollHeight;
    }
</script>