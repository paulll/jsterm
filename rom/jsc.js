apps.jsc = function (args, redir, callback) {
	
	if (redir) {
		callback();
		return 'Output of this command can not be redirected';
	}
	
	util.console.print('Type exit() to exit', util.theme.color.info);
	
	function exec () {
		util.console.read ('js> ', 'ENTER', function (e) {
			if (e.split(' ').join('') === 'exit()') {
				callback();
			} else {
				try {
					util.console.print(eval(e));
					exec();
				} catch (e) {
					util.console.print(e, util.theme.color.error);
					exec();
				}
			}
		})
	}
	
	exec();
}

manifest['jsc'] = {
	async: true,
	help: {
		'en-US': "javascript interactive console",
		'ru-RU': "Интерактивная консоль javascript"
	},
	usage: 'jsc'
}