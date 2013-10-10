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
	
	dir = args[0].split('/');
	
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
	
	ndir = '/'+ndir.join('/');
	
	util.tdata.pwd = ndir;

	if (!redir) {
		util.console.print(ndir)
	} else {
		return ndir;
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

apps.help = function (args, redir) {
	if (args[0]) {
		if (redir) {
			return manifest[args[0]].help[util.language || 'en-US'];
		} else {
			util.console.print(manifest[args[0]].help[util.language || 'en-US'])
		}
	} else {
		
		var help = [];
		var largest  = 0;
		
		for (var appid in manifest) {
			
			if (appid.length > largest) {largest = appid.length}
			
			help.push(appid + ' ' + manifest[appid].help[util.language || 'en-US']);
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
	
	if (redir) {
		return manifest[args[0]].usage[util.language || 'en-US'];
	} else {
		util.console.print(manifest[args[0]].usage[util.language || 'en-US']);
	}
}

manifest.appbox = {
	help: {
		"en-US": "Load main commands package: echo, cd, pwd, var, help, apps, usage"
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
		"en-US": "Load main commands package: echo, cd, pwd, var, help, apps, usage"
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