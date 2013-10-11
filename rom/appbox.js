apps.appbox = function (cmd, redir) {
	if (!redir) {
		util.console.print('appbox modules loaded!', util.theme.color.info);
	}
}

apps.echo = function (args, redir) {
	if (!redir){return util.console.print(args.join(' '))}
	return args[0];
}

apps.cd = function (args, redir) {
	
	var dir = util.fs.getRealPath (args[0]);
	
	util.tdata.pwd = dir;

	if (!redir) {
		util.console.print(dir)
	} else {
		return dir;
	}
}

apps.pwd = function (args, redir) {
	if (!redir) {
		util.console.print(util.tdata.pwd);
	} else {
		return util.tdata.pwd;
	}
}

apps.var = function (args, redir) {
	var a2 = args[2],
    a1 = args[1],
    name = args[0],
   	result = '';
    
    if (a2 == undefined) {
        localStorage.setItem("terminal_var_"+name, a1);
        result = a1;
        return false;
    }
    if (a1 == "=") {
        localStorage.setItem("terminal_var_"+name, a2);
        result = a2;
        return false;
    }
    if (a1 == a2 == undefined) {
        var t = name.split('=');
        localStorage.setItem("terminal_var_"+t[0], t[1]);
        result = t[1];
        return false;
    }
    
    if (!redir) {
    	util.console.print(result);
    } else {
    	return result;
    }
    
    return false;

}

apps.uname = function (args, redir) {
	util.tdata.user = args[0] || util.tdata.user;
	
	if (redir) {
		return util.tdata.user;
	}
	
	util.console.print(util.tdata.user);
}
apps.sysname = function (args, redir) {
	util.tdata.system = args[0] || util.tdata.system;
	
	if (redir) {
		return util.tdata.system;
	}
	
	util.console.print(util.tdata.system);
}
apps.promptstyle = function (args, redir) {
	util.theme.promptStyle = args[0] || util.theme.promptStyle;
	
	if (redir) {
		return util.theme.promptStyle;
	}
	
	util.console.print(util.theme.promptStyle);
}

apps.help = function (args, redir) {
	if (args[0]) {
		if (redir) {
			return manifest[args[0]].help[util.language || 'en-US'] || 'Help not found';
		} else {
			if (!manifest) {
				util.console.print('[FATAL]: Manifest DB is removed. Reload page')
			} else if (!manifest[args[0]]) {
				util.console.print('[Error]: Command does not exist or command manifest is invalid', util.theme.color.error);
			} else if (!manifest[args[0]].help) {
				util.console.print('[Error]: No help data given for this command. Ask it\'s developer xD', util.theme.color.error)
			} else if (!manifest[args[0]].help[util.language || 'en-US']) {
				util.console.print('[Error]: No help data given for your language', util.theme.color.error)
			} else {
				util.console.print(manifest[args[0]].help[util.language || 'en-US']);
			}
		}
	} else {
		
		var help = [];
		var largest  = 0;
		
		for (var appid in manifest) {
			
			if (manifest && manifest[appid] && manifest[appid].help && manifest[appid].help[util.language || 'en-US']) {
				if (appid.length > largest) {largest = appid.length}
				help.push(appid + ' ' + manifest[appid].help[util.language || 'en-US']);
			}
		}
		
		if (redir) {
			return help;
		} else {
			
			var fhelp = [];
		
			help.forEach (function (line) {
				var desc = line.split(' '), name;
				
				name = desc.shift();
				desc = desc.join(' ');
				
				var appname = name + Array(largest - name.length + 2).join(' ');
				
				fhelp.push (appname + desc)
			});
			
			util.console.print(fhelp.join('\n'));
		}
	}
}

apps.apps = function (args, redir) {
	var appz = [];
		
	for (var appid in apps) {
		appz.push(appid);
	}
	
	if (redir) {
		return appz;
	} else {
		util.console.print(appz.join('\n'));
	}
}

apps.usage = function (args, redir) {
	if (!args[0]) {
		if (redir) {
			return '[error]: this command needs 1 argument';
		} else {
			util.console.print('[error]: this command needs 1 argument')
			return;
		}
	}
	
	var appid = args[0];
	
	if (redir) {
		if (manifest && manifest[appid] && manifest[appid].usage) {
			return manifest[appid].usage;
		} else {
			return false;
		}
	} else {
		if (!manifest) {
			util.console.print('[FATAL]: Manifest DB is removed. Reload page')
		} else if (!manifest[appid]) {
			util.console.print('[Error]: Command does not exist or command manifest is invalid', util.theme.color.error);
		} else if (!manifest[appid].usage) {
			util.console.print('[Error]: No usage data given for this command. Ask it\'s developer xD', util.theme.color.error)
		} else {
			util.console.print(manifest[args[0]].usage)
		}
	}
}

manifest.appbox = {
	help: {
		"en-US": "This command must be in autostart. It's already running"
	},
	async: false,
	usage: "appbox"
}

manifest.echo = {
	help: {
		"en-US": "Prints line with text in arguments"
	},
	async: false,
	usage: "echo <text> [text, text, ...]"
}

manifest.cd = {
	help: {
		"en-US": "Change working directory"
	},
	async: false,
	usage: "cd <directory>"
}

manifest.var = {
	help: {
		"en-US": "Set value of variable"
	},
	async: false,
	usage: "var name value \nOR var name=value\nOR var name = value"
}

manifest.pwd = {
	help: {
		"en-US": "Print working directory"
	},
	async: false,
	usage: "pwd"
}

manifest.help = {
	help: {
		"en-US": "This command"
	},
	async: false,
	usage: "help [app]"
}

manifest.apps = {
	help: {
		"en-US": "List all loaded apps"
	},
	async: false,
	usage: "apps"
}

manifest.usage = {
	help: {
		"en-US": "Show usage of command"
	},
	async: false,
	usage: "usage <command>"
}