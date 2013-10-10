apps['test'] = function(args, redir, callback) {
	var read = util.console.read,
		write = util.console.write,
		print = util.console.print;

	print('# unit tests #');
	print('');
	print('test console or OS?')

	read('(console/os) [console] > ', 'ENTER', function(result) {
		if (result == 'os') {
			print('os tests are not available now. exiting');
			callback()
		} else {
			print('running console tests');
			print('');
			print('test 1: testing colors.')
			print('');
			print('red text', util.theme.color.error);
			print('orange text on black background', util.theme.color.warning, 'black');
			print('bold cyan text', util.theme.color.info, false, true);
			print('');
			print('test 2: prompt styles.');
			print('');

			print('1. cloudx style');
			print(util.tdata.user + '@' + util.tdata.system + ' ' + util.tdata.pwd + ' # ', util.theme.color.prompt);

			print('');

			print('2. ubuntu style');
			print(prompt = util.tdata.user + '@' + util.tdata.system + ':' + util.tdata.pwd + '$ ', util.theme.color.prompt);

			print (' ')

			print('3. fedora style');
			print('[' + util.tdata.user + '@' + util.tdata.system + ' ' + (util.tdata.pwd.split('/').pop() || '/') + ']$ ', util.theme.color.prompt);

			print('');

			print('active style is ');
			write(util.theme.promptStyle+'', util.theme.color.prompt);

			print('');
			print('test 3: textutils');

			var text = 'slowprint'.split('');

			print('');
			print('');
			var it = setInterval(function() {
				var char = text.shift();
				if (char) {
					write(char);
				} else {
					clearInterval(it);

					print('');
					print('');

					text = 'rainbowprint'

					function byte2Hex(n) {
					    return String("0123456789ABCDEF".substr((n >> 4) & 0x0F,1)) + "0123456789ABCDEF".substr(n & 0x0F,1);
					}

					function RGB2Color(r, g, b) {
						return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
					}

					function colorText(str, phase) {
						if (phase == undefined) {
							phase = 0;
							center = 128;
							width = 127;
							frequency = Math.PI * 2 / str.length;
						}
						for (var i = 0; i < str.length; ++i) {
							red = Math.sin(frequency * i + 2 + phase) * width + center;
							green = Math.sin(frequency * i + 0 + phase) * width + center;
							blue = Math.sin(frequency * i + 4 + phase) * width + center;
							write(str.substr(i, 1), RGB2Color(red, green, blue));
						}
					}

					colorText(text);

					callback(' ');
				}
			}, 100);
		}
	})
}

manifest['test'] = {
	help: {
		'ru-RU': 'Простой менеджер пакетов',
		'en-US': 'Simple package manager',
	},
	usage: 'cx-get <install (-i) | remove (-r)> <package name> [--force (-f)]',
	async: true
}