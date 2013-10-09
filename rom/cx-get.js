apps['cx-get'] = function (args, redir, callback) {
	
function checkRemoteFile (path, callback) {
	var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', path, true);
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4) {
     callback(xmlhttp.status === 200)
  }
};
xmlhttp.send(null);
}
	
	function install (path) {
			cx.API ({
			"method": "system.install",
			"executable": path,
		}, function (a) {
			util.console.print ('[done]');
		});
	}
	if (args[0] === 'install' || args[0] === '-i') {
		util.console.print('Install package '+args[1]+' ?');
		util.console.read('(y/n) [n] > ', 'ENTER', function (result) {
			if (result === 'y') {
				util.console.print ('Searching package: in cloudx system repository');
				checkRemoteFile ('//alpha.cloudx.cx/system/app/'+args[1], function (cxsyst) {
					if (!cxsyst) {
						util.console.print ('[not found]', util.theme.color.error);
						util.console.print ('Searching package: in x dot cloudx repository');
						
						checkRemoteFile ('x.cloudx.cx/repo/'+args[1], function (xdotcloudx) {
							if (!xdotcloudx) {
								util.console.print ('[not found]', util.theme.color.error);
								util.console.print ('Searching package: in cloudx main repository');
							
								checkRemoteFile ('//repo.cloudx.cx/'+args[1], function (cxmain) {
									if (!cxmain) {
										util.console.print ('[not found]', util.theme.color.error);
										
										util.console.print ('Searching package: in local file system (/user/apps/)');
				
										cx.API ({
											"method": "fs.ls",
											"path": "/user/apps/"
										}, function (resp) {
											if (resp.indexOf(args[1]+'/')!==-1) {
												util.console.print ('[found]', util.theme.color.info);
												util.console.print ('Updating data base');
												install("filesystem:http://alpha.cloudx.cx/persistent/user/apps/"+args[1]);
											} else {
												util.console.print ('[not found]', util.theme.color.error);
												callback (true);
											}
										});
									} else {
										install('//repo.cloudx.cx/'+args[1]);
										callback (true);
									}
								});
							} else {
								install('x.cloudx.cx/repo/'+args[1]);
								callback (true);
							}
						});
					} else {
						install('//alpha.cloudx.cx/system/app/'+args[1]);
						callback(true);
					}
				});
				
				//util.console.print ('Searching package: in cloudx non-free repository');
				//util.console.print ('[not found]', util.theme.color.error);
				
				
				
				
			/*	util.console.print ('Caching / downloading package');
				
				util.console.print ('Caching / downloading libs');
				util.console.print ('Libs to be downloaded: 1');
				util.console.print (' - cloudx-lib-3.3.0-alpha');
					
					util.console.print ('Lib'); 
					util.console.write (" cloudx-lib-3.3.0-alpha ", 0, 0, true);
					util.console.write ('is already istalled.')
				
				util.console.print ('Uploading app list to cloudx server');
				util.console.print ('[done]', util.theme.color.info);
			*/
				//callback (true);
			} else {
				callback (true);
			}
		});
	} else {
		util.console.print ('No arguments given. Use "usage cx-get" to get more information about this comand', util.theme.color.error);
		callback (false);
	}
}

manifest['cx-get'] = {
	help: {
		'ru-RU': 'Простой менеджер пакетов',
		'en-US': 'Simple package manager',
	},
	usage: 'cx-get <install (-i) | remove (-r)> <package name> [--force (-f)]',
	async: true
}