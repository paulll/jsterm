function $(a){return document.getElementById(a);}

var util = {
	
	language: 'en-US',
	
	
	fs: {
		fileGetContents: function (path) {},
		fileSetContents: function (path) {},
		ls: function (path) {},
		mkdir : function (path) {},
		getRealPath: function (dir) {
			dir = dir.split('/');
			
			if (dir[0] === '.') {
				dir.splice(0,1,util.tdata.pwd);
			} else if (dir[0] !== '') {
				dir.splice(0,0,util.tdata.pwd)
			}
			
			dir = dir.join('/').split('/');
			
			var ndir = [];
			
			dir.forEach(function (v,i) {
				if (v === '..') {
					ndir.pop();
				} else if (v === '.') {
					// do nothing
				} else if (v === '') {
					// do nothing
				} else {
					ndir.push(v);
				}
			});
			
			return  '/'+ndir.join('/');
		},
		getFileName: function (path) {
			return path.split('/').pop();
		}
	},

	cursor: {
		setPos: function (char, line) {
			char = char || util.cursor.pos[0];
			line = line || util.cursor.pos[1];
			
			if ($('terminal').scrollTop!==$('terminal').scrollHeight-$('terminal').offsetHeight) {
				util.cursor.hide();
			} else {
				util.cursor.show();
			}
			
			line = $('terminal').childNodes.length-1;
			
			util.cursor.pos = [char, line]
			
			$('cursor').style.top = line*$('cursor').offsetHeight-$('terminal').scrollTop+'px';
			$('cursor').style.left= char*$('cursor').offsetWidth+'px';
		},
		getPos: function (mode) {
			if (!mode) {
				return {line:util.cursor.pos[1], char:util.cursor.pos[0]};
			}
			if (mode === 'line') {
				return util.cursor.pos[1];
			}
			return util.cursor.pos[0];
		},
		hide: function () {
			$('cursor').style.display = 'none';
		},
		show: function () {
			$('cursor').style.display = null;
		},
		toggle: function () {},
		
		pos: [0,0],
		isHidden: false
	},
	
	console: {
		write: function (text, color, bgcolor, bold) {
			color = color || util.theme.color.text;
			bgcolor = bgcolor || util.theme.color.textBackground;
			
			var lines = text.split('\n');
				text = lines.shift();
			
			if (lines.length !== 0) {
				util.console.print (lines.join('\n'), color, bgcolor, bold);
			}
			
			var i = $('terminal').childNodes.length-1;
			
			do {
				var row = $('terminal').childNodes[i--];
				if (row && !row.classList.contains('reader')) {
					break;
				}
				row = false;
			} while ( i !== 0);
			
			var rowElement, alreadyExists;
			
			if (row) {
				var l = row.childNodes.length;
				
				function rgb2hex(rgb_) {
					rgb = rgb_.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
					if (!rgb) {
						return rgb_;
					}
					
					function hex(x) {
						return ("0" + parseInt(x).toString(16)).slice(-2);
					}
					return ("#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
				}
				
				rowElement = row.childNodes[row.childNodes.length-1];
				
				if ( (rgb2hex(rowElement.style.color) === color) && ((rowElement.style.fontWeight === 'bold') == !!bold) && (rgb2hex(rowElement.style.backgroundColor) === bgcolor)) {
					alreadyExists = true;	
				} else {
					rowElement = undefined;
				}
			}
			
			if (rowElement && rowElement.innerText === ' ') {
				rowElement.innerText = '';
			}
			
			rowElement = rowElement || document.createElement('span');
				rowElement.innerText = (alreadyExists) ? rowElement.innerText+text : text;
				rowElement.style.color = color;
				rowElement.style.fontWeight = (bold) ? 'bold' : 'normal';
				rowElement.style.backgroundColor = bgcolor;
			
			if (!row) {
				util.cursor.setPos(false, util.cursor.getPos('line')+1);
				row = document.createElement('div');
					row.className = 'row';
				$('terminal').insertBefore(row, $('reader'));
			} else {
				if (row.childNodes[row.childNodes.length-1].innerText === ' ') {
					row.childNodes[row.childNodes.length-1].innerText = '';
				}
			}
			
			row.appendChild(rowElement);
			
			return Array.prototype.indexOf.call($('terminal').childNodes,row);
		},
		print: function (text, color, bgcolor, bold, reader) {
			color = color || util.theme.color.text;
			bgcolor = bgcolor || util.theme.color.textBackground;
			
			text = text + ''; // if number given
			if (!text) {text = ' '} // to prevent cursor lags and create empty string
			text = text.split(' ').join(' '); // to prevent cursor lags
			
			var lines = text.split ('\n');
			
			var line = lines.shift();
			
			var rowElement = document.createElement('span');
				rowElement.innerText = line;
				rowElement.style.color = color;
				rowElement.style.fontWeight = (bold) ? 'bold' : 'normal';
				rowElement.style.backgroundColor = bgcolor;
			var row = document.createElement('div');
				row.className = 'row';
				row.appendChild(rowElement);
				
			
			if (reader) {
				row.id = 'reader';
				var tt = $('reader');
				if (tt) { tt.classList.remove('reader'); tt.id = '';}
			}
			
			$('terminal').insertBefore(row, $('reader'));
			util.cursor.setPos(false, util.cursor.getPos('line')+1);
			
			if (lines.length!==0) {
				return util.console.print(lines.join('\n'), color, bgcolor, bold);
			}
			
			return Array.prototype.indexOf.call($('terminal').childNodes,row);
		},
		clear: function () {
			Array.prototype.forEach.call($('terminal').childNodes, function (element) {
				if (!element.classList.contains('reader')) {
					element.parentNode.removeChild(element);
				}
			});
		},
		
		clearLine: function (line) {
			$('terminal').removeChild($('terminal').childNodes[line]);
			return line;
		},
		insertLine: function (line, text, color, bgcolor, bold) {
			$('terminal').childNodes[line].classList.add('reader');
			var out = util.console.print(text, color, bgcolor, bold);
			$('terminal').childNodes[line].classList.remove('reader');
			return out;
		},
		
		read: function (prompt, key, callback) {
			
			util.console.print(prompt, util.theme.color.prompt, false, false, true);
			
			util.cursor.setPos(prompt.length);
			
			var input = '';
			
			// some magick
			key = key.split('+');
			ctrl = (key[0] === 'CTRL');
			key = (ctrl) ? key [1] : key [0];
			key = (key==='ENTER') ? 13 : key;
			
			window.onkeypress = function (event) {
				
				var char = String.fromCharCode(event.which);
				
				// 'magick'. do not touch it
				if (( event.which === key || char.toLowerCase() === key+''.toLowerCase()) && ((event.ctrlKey && ctrl) || !ctrl)) {
					window.onkeypress = null;
					window.onkeydown = null;
					var tt = $('reader').id = '';
					callback(input);
					return false;
				}
				
				var part_1 = input.substring(0, util.cursor.getPos('char')-prompt.length);
				var part_2 = input.substring(util.cursor.getPos('char')-prompt.length, input.length);
				
				input = part_1+char+part_2;
				
				$('terminal').removeChild($('reader'));
				util.console.print(prompt, util.theme.color.prompt);
				util.console.write(input);
				$('terminal').childNodes[$('terminal').childNodes.length-1].id = 'reader';
				
				util.cursor.setPos(util.cursor.getPos('char')+1);
				
				return false;
			}
			
			window.onkeydown = function (event) {
				if ( event.which === 8) {
					var part_1 = input.substring(0, util.cursor.getPos('char')-prompt.length-1);
					var part_2 = input.substring(util.cursor.getPos('char')-prompt.length, input.length);
					
					if (input !== part_1+part_2) {
						util.cursor.setPos(util.cursor.getPos('char')-1);
						
						input = part_1+part_2;	
						
						console.log($('terminal').childNodes.length-1);
						
						$('terminal').removeChild($('reader'));
						util.console.print(prompt, util.theme.color.prompt);
						util.console.write(input);
						$('terminal').childNodes[$('terminal').childNodes.length-1].id = 'reader';
					}
					
					return false;
				}
				if ( event.which === 39 ) {
					var chr = util.cursor.getPos('char');
						chr = (prompt.length+input.length === chr) ? chr : chr+1;
					util.cursor.setPos(chr);
				} 
				if (event.which === 37) {
					var chr = util.cursor.getPos('char');
						chr = (chr === prompt.length)? chr : chr-1;
					util.cursor.setPos(chr);
				}
			}
		}
	},


	tdata: {
		pwd: '/user/desktop',
		user: 'paulll',
		system: 'cloudx-3.3',
		localvars: {},
	},
	
	theme: {
		
		// 1	user@system /path/to/dir # input	cloudx
		// 2	user@system:/path/to/dir$ input		ubuntu
		// 3	[user@system dir]$ input			fedora
		
		promptStyle: 1,
		
		color: {
			text: '#F7F7F7',
			textBackground: 'transparent',
			background: '#242424',
			info: '#59D0FF',
			error: '#C75646',
			warning: '#FFB259',
			prompt: '#8EB33B'
		}
	},
}
window.onload = function () {
	document.body.style.backgroundColor = util.theme.color.background;
	$('cursor').style.color = util.theme.color.prompt;
	$('cursor').style.backgroundColor = util.theme.color.prompt;
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var objDiv = $('terminal');
	objDiv.scrollTop = objDiv.scrollHeight;
  });    
});
window.onresize = function () {
	util.cursor.setPos(); // recalculate
}
$('terminal').onscroll = function  () {
	util.cursor.setPos(); // recalculate
}

// configuration of the observer:
var config = { childList: true };
 
// pass in the target node, as well as
	observer.observe($('terminal'), config);
}