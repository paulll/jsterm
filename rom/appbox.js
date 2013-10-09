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

