apps.cx = function (args, redir, callback) {
	
	if (redir) {
		callback(false);
		return false;
	}
	
	if (args[0]) {
		
		var currentProp = '';
		var props = {method:args.shift()};
		var error = false;
		
		args.forEach (function (v) {
			
			if (error) {
				return;
			}
			
			if (currentProp) {
				props[currentProp] = v;
				currentProp = '';
			} else if (v.charAt(0) === '-' && v.charAt(1)) {
				currentProp = v.substring(2);
			} else {
				error = true;
				util.console.print('[error]: unexpected string');
				exec();
			}
		});
		
		if (!error) {
			cx.API(props, function (e){
				util.console.print(e+'');
				callback();
			})
		}
		
		return;
	}
	
	function parse (str) {
		var returning = [];
		var tempWord = '';
		var quote = '';
		var raw = false;

		str.split('').forEach(function (chr) {
			switch (chr) {
				case "'":
					if (raw) {
						tempWord = tempWord + chr;
						raw = false;
					} else if (quote === "'") {
						quote = '';
					} else if (quote !== '"') {
						quote = "'";
					} else {
						tempWord = tempWord + chr;
					}
					break;
				case '"':
					if (raw) {
						tempWord = tempWord + chr;
						raw = false;
					} else if (quote === '"') {
						quote = '';
					} else if (quote !== "'") {
						quote = '"';
					} else {
						tempWord = tempWord + chr;
					};
					break;
				case "\\":
					if (raw) {
						tempWord = tempWord + chr;
						raw = false;
					} else {
						raw = true;
					}
					break;
				case " ":
					if (quote === '') {
						if (tempWord.length === 0) {
							threrror('[Ошибка]: Непредвиденное появление " ".');
							return false;
						} else {
							returning.push(tempWord);
							tempWord = '';
						}
					} else {
						tempWord = tempWord + chr;
					}
					break;
				case "%":
					if (raw) {
						tempWord = tempWord + chr;
						raw = false;
					} else if (quote !== '') {
						tempWord = tempWord + chr;
					} else if (tempWord.charAt(0) === '%') {
						tempWord = localStorage.getItem('terminal_var_' + tempWord.substring(1))
					} else if (tempWord.length === 0) {
						tempWord = tempWord + chr;
					} else {
						threrror('[Ошибка]: Непредвиденное появление "%".');
						return false;
					};
					break;
				default:
					tempWord = tempWord + chr;
				
			}
		});
		returning.push(tempWord);
		
		return returning;
	}
	
	function exec () {
		util.console.read (util.tdata.user+'@cloudx-api # ', 'ENTER', function (inp) {
			
			if (inp == 'exit') {
				callback();
			}
			
			inp = parse (inp);
			
			var currentProp = '';
			var props = {method:inp.shift()};
			var error = false;
			
			inp.forEach (function (v) {
				
				if (error) {
					return;
				}
				
				if (currentProp) {
					props[currentProp] = v;
					currentProp = '';
				} else if (v.charAt(0) === '-' && v.charAt(1)) {
					currentProp = v.substring(2);
				} else {
					error = true;
					util.console.print('[error]: unexpected string');
					exec();
				}
			});
			
			if (!error) {
				cx.API(props, function (e){
					util.console.print(e+'');
					exec();
				})
			}
			
		});
	}
	
	exec()
} 

manifest['cx'] = {
	async: true,
	help: {
		'en-US': 'cx api console'
	}
}