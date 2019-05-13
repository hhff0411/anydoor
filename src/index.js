// process.argv
const yargs = require('yargs');

const Server = require('./app.js');

const argv = yargs
	.usage('anywhere [options]')
	.option('p', {
		alias: 'port',
		describe: '端口号',
		defalut: 3000
	})
	.option('h',{
		alias: 'hostname',
		describe: 'host',
		defalut: '127.0.0.1'
	})
	.option('d',{
		alias: 'root',
		describe: 'root path',
		defalut: process.cwd()
	})

const server = new Server(argv);
server.start();