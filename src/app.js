const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const route = require('./helper/route.js');
const conf = require('./config/defaultConfig.js');

const openUrl = require('./helper/openUrl.js');//自动打开url

class Server {
	constructor(config){
		this.conf = Object.assign({}, conf, config);
	}

	start() {
		const server = http.createServer((req,res) => {
			const url = req.url;
			const filePath = path.join(this.conf.root, url);
			
			route(req, res, filePath, this.conf);
			
		})

		server.listen(this.conf.port, this.conf.hostname, () => {
			const addr = `http://${this.conf.hostname}:${this.conf.port}`;
			console.log(`Server started at ${chalk.green(addr)}`);

			openUrl(addr);
		})
	}
}

module.exports = Server;


// const server = http.createServer((req,res) => {
// 	const url = req.url;
// 	const filePath = path.join(conf.root, url);
	
// 	route(req, res, filePath, conf);
	

// 	// fs.stat(filePath, (err, stats) => {
// 	// 	if(err){
// 	// 		res.statusCode = 404;
// 	// 		res.setHeader('Content-Type', 'text/plain');
// 	// 		res.end(`${filePath} is not a directory or file`);
// 	// 		return;
// 	// 	};

// 	// 	if(stats.isFile()){
// 	// 		res.statusCode = 200;
// 	// 		res.setHeader('Content-Type', 'text/plain');
// 	// 		// fs.readFile(filePath, (err,data) => {
// 	// 		// 	res.end(data);
// 	// 		// });   响应速度非常慢
// 	// 		fs.createReadStream(filePath).pipe(res); //建议使用这种方式(流的方式)
// 	// 	} else if(stats.isDirectory()) {
// 	// 		fs.readdir(filePath, (err, files) => {
// 	// 			res.statusCode = 200;
// 	// 			res.setHeader('Content-Type', 'text/plain');
// 	// 			res.end(files.join(","));
// 	// 		});
// 	// 	}
// 	// })


// 	// res.statusCode = 200;
// 	// res.setHeader('Content-Type', 'text/plain');
// 	// res.setHeader('Content-Type', 'text/html');
// 	// res.write('<html>');
// 	// res.write('<body>');
// 	// res.write('hello Http');
// 	// res.write('</body>');
// 	// res.write('</html>');
// 	// res.end();

// 	// res.end(filePath);
// })

// server.listen(conf.port, conf.hostname, () => {
// 	const addr = `http://${conf.hostname}:${conf.port}`;
// 	console.log(`Server started at ${chalk.green(addr)}`);
// })