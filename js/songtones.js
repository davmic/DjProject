 document.getElementById("songtn1").addEventListener('click', function(e){
        var self = this,
            old_bg = this.style.background,
            bb = this.style.borderBottom;
        
        this.style.background = this.style.background=='#f02c2c'? '#f02c2c':'#f02c2c';
        this.style.borderBottom = this.style.borderBottom=='2px solid #000000'? '#000000':'#000000';
        saudio1.play();
        setTimeout(function(){
            self.style.background = old_bg;
            self.style.borderBottom = bb;

        }, 2000);
    })

    document.getElementById("songtn2").addEventListener('click', function(e){
        var self = this,
            old_bg = this.style.background,
            bb = this.style.borderBottom;
        
        this.style.background = this.style.background=='#f02c2c'? '#f02c2c':'#f02c2c';
        this.style.borderBottom = this.style.borderBottom=='2px solid #000000'? '2px solid #000000':'2px solid #000000';
        saudio2.play();
        setTimeout(function(){
            self.style.background = old_bg;
            self.style.borderBottom = bb;

        }, 2200);
    })

    document.getElementById("songtn3").addEventListener('click', function(e){
        var self = this,
            old_bg = this.style.background,
            bb = this.style.borderBottom;
        
        this.style.background = this.style.background=='#f02c2c'? '#f02c2c':'#f02c2c';
        this.style.borderBottom = this.style.borderBottom=='2px solid #000000'? '#000000':'#000000';
        saudio3.play();
        setTimeout(function(){
            self.style.background = old_bg;
            self.style.borderBottom = bb;

        }, 1300);
    })

    document.getElementById("songtn4").addEventListener('click', function(e){
        var self = this,
            old_bg = this.style.background,
            bb = this.style.borderBottom;
        
        this.style.background = this.style.background=='#f02c2c'? '#f02c2c':'#f02c2c';
        this.style.borderBottom = this.style.borderBottom=='2px solid #000000'? '#000000':'#000000';
        saudio4.play();
        setTimeout(function(){
            self.style.background = old_bg;
            self.style.borderBottom = bb;

        }, 1100);
    })