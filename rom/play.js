var	playing = {};

apps.play = function (args, redir) {
	
	var path = args.shift();
	var dir  = path.split('/');
	var file = dir.pop();
	
	dir = '/' + dir.join('/');
	
	function Sound(source,volume,loop) {
		this.source=source;
		this.volume=volume;
		this.loop=loop;
		var son;
		this.son=son;
		this.finish=false;
		this.stop=function() {
			document.body.removeChild(this.son);
		}
		this.start=function() {
			if(this.finish)return false;
			this.son=document.createElement("embed");
			this.son.setAttribute("src",this.source);
			this.son.setAttribute("hidden","true");
			this.son.setAttribute("volume",this.volume);
			this.son.setAttribute("autostart","true");
			this.son.setAttribute("loop",this.loop);
			document.body.appendChild(this.son);
		}
		this.remove=function() {
			document.body.removeChild(this.son);
			this.finish=true;
		}	
		this.init=function(volume,loop) {
			this.finish=false;
			this.volume=volume;
			this.loop=loop;
		}
	}
	
	var toHHMMSS = function (a) {
		var sec_num = a;
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
	
		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time	= hours+':'+minutes+':'+seconds;
		return time;
	}
	
	util.console.print('loading sound..');
	
	cx.API ({method: 'fs.ls', path: dir}, function (list) {
		if (list.indexOf(file)) {
			cx.API ({method: 'fs.readFile', path: path}, function (blob) {
				playing = new Sound (URL.createObjectURL(blob), 100, false);
			});
		}
	});
}