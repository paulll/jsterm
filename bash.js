var apps = {};
var manifest = {};

function bash(input) {
	input = input || [];
	if (input.indexOf('--file') !== -1) {
		util.fs.fileGetContents(util.parsePath(input.indexOf('--file') + 1));
	} else {
		
		var prompt;

		switch (util.theme.promptStyle) {
			case 1:
				// cloudx style;
				
				prompt = util.tdata.user + '@' + util.tdata.system + ' ' + util.tdata.pwd + ' # ';
				
				break;
			case 2: 
				// ubuntu style;
				
				prompt = util.tdata.user + '@' + util.tdata.system + ':' + util.tdata.pwd+ '$ ';
				
				break;
			case 3: 
				// fedora style;
				
				prompt = '['+util.tdata.user+'@'+util.tdata.system+' '+(util.tdata.pwd.split('/').pop()||'/')+']$ ';
				
				break;
			default: 
				// cloudx style;
				
				prompt = util.tdata.user + '@' + util.tdata.system + ' ' + util.tdata.pwd + ' # ';
				
				break;
		}

		util.console.read (prompt, 'ENTER', function (command) {
			var returned = execute(prepare(command), function () {
				bash();
			});
			if (returned.hasOwnProperty('ERROR')) {
				util.console.print(returned.TEXT, util.theme.color.error);
				bash();
			}
			
		});
	}

	// лексический анализатор

	function prepare(str) {

		var ERROR = false;

		threrror = function (e) {
			console.error(e);
			ERROR = e;
		};

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

		console.debug("Результат первого прохода: ", returning);

		// 2-й проход

		if (ERROR) {
			return {
				'ERROR': 1,
				'TEXT': ERROR
			};
		}

		var tempCommand = false;
		var commands = [];

		returning.forEach(function (element) {
			
			if (ERROR) {return false;}
			
			switch (element) {
			case '||':
				if (tempCommand) {
					commands.push(tempCommand);
					tempCommand = false;
				} else {
					threrror('[Ошибка]: Неожиданное появление "' + element + '".');
					return false;
				}
				commands.push({
					"type": 'tonext'
				});
				break;
			case '>>':
				if (tempCommand) {
					commands.push(tempCommand);
					tempCommand = false;
				} else {
					threrror('[Ошибка]: Неожиданное появление "' + element + '".');
					return false;
				}
				commands.push({
					"type": 'tofile'
				});
				break;
			case '&&':
				if (tempCommand) {
					commands.push(tempCommand);
					tempCommand = false;
				} else {
					threrror('[Ошибка]: Неожиданное появление "' + element + '".');
					return false;
				}
				commands.push({
					"type": 'next'
				});
				break;
			case '>':
				if (tempCommand) {
					commands.push(tempCommand);
					tempCommand = false;
				} else {
					threrror('[Ошибка]: Неожиданное появление "' + element + '".');
					return false;
				}
				commands.push({
					"type": 'tofile_r'
				});
				break;
			default:
				if (tempCommand === false) {
					tempCommand = {
						"type": "command",
						"name": element,
						"arguments": []
					};
				} else {
					tempCommand.arguments.push(element)
				}
			}
		});
		if (!tempCommand && !ERROR) {
			threrror('[Ошибка]: Что-то пошло не так');
		}
		commands.push(tempCommand);
		if (ERROR) {
			return {
				'ERROR': 1,
				'TEXT': ERROR
			};
		}
		console.debug("Результат второго прохода: ", commands);
		return commands;
	}


	// исполнение кода

	function execute(code, callback) {
		if (!code) {
			return {ERROR: 1, TEXT: "[Ошибка]: Что-то пошло не так.."}
		}

		if (code.hasOwnProperty('TEXT')) {
			return code;
		}

		function concatence(a1, a2) {
			if (typeof a2 !== 'object') {
				a1.push(a2);
			}
			a2.forEach(function (v) {
				a1.push(v);
			});
			return a1;
		}

		function runApp(name, redir, args, callback) {
			if (!apps[name]) {
				var sc = document.createElement('script');
				sc.src = 'rom/'+name+'.js'
				sc.onload = function () {
					if (apps[name]) {
						if (manifest[name] && manifest[name].async) {
							apps[name](args, redir, callback);
						} else {
							callback(apps[name](args, redir));
						}
					} else {
						util.console.print('[Ошибка]: Нет такого файла/приложения: "'+name+'"', util.theme.color.error);
						callback(false);
					}
				}
				sc.onerror = function () {
					util.console.print('[Ошибка]: Нет такого файла/приложения: "'+name+'"', util.theme.color.error);
					callback(false);
				}
				document.getElementsByTagName('head')[0].appendChild(sc);
			} else {
				if (manifest[name] && manifest[name].async) {
					apps[name](args, redir, callback);
				} else {
					callback(apps[name](args, redir));
				}
			}
		}
		
		var lastReturn;
		
		function recursive (i, callback) {
			
			var element = code[i],
				nextElement = code[i+1];
			
			if (element.type === 'command') {
				
				console.debug('element', i, 'is command, so running ', element.name);
				
				runApp(element.name, !!nextElement, element.arguments, function (ret) {
					
					console.debug('calling back result of ', element.name, 'run;');
					
					if (nextElement) {
						
						console.debug('output will be redirected');
						
						if (nextElement.type == 'tonext') {
							
							console.debug('.. to next command');
							
							if (!code[i+2] || code[i+2].type !== 'command') {
								console.debug('oooops, next command is not present');
								callback (false);
							}
							
							code[i+2].arguments.push (ret);
							
							recursive(i+2, function (returning) {
								
								console.debug('calling back in callback recurive');
								
								callback(returning);
							});
						}
					} else {
						callback (ret);
					}
				});
			}
		}
		
		recursive(0, function (ret) {
			if (!ret) {
				
			}
			bash();
		});

		
		return false;
	}
}

// post init

apps.bash = bash;
util.console.print('Cloudx shell; \n use "appbox" to load some utilites', util.theme.color.info);