//注:在使用路径的时候,除了require用相对路径外,其他的尽量使用绝对路径

const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');//模板引擎

const path = require('path');//路径模块

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);//readFileSync  同步方法  读出来的是buffer,可用第二个参数设置如utf-8,也可toString强制转化
const template = Handlebars.compile(source.toString());
const range = require('./rang.js');

const config = require('../config/defaultConfig.js')
const mime = require('./mime.js');//文件后缀名

const compress = require('./compress.js');//压缩

module.exports = async function (req, res, filePath){

	try{
		const stats = await stat(filePath);
		if(stats.isFile()){
			const contentType = mime(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', contentType);
			let rs;
			const {code, start, end} = range(stats.size, req, res);
			if(code === 200){
				rs = fs.createReadStream(filePath);
			} else {
				rs = fs.createReadStream(filePath, {start, end});
			}
			// res.setHeader('Charset', 'utf8');
			// fs.readFile(filePath, (err,data) => {
			// 	res.end(data);
			// });   响应速度非常慢
			// fs.createReadStream(filePath).pipe(res); //建议使用这种方式(流的方式)
			// const rs = fs.createReadStream(filePath);
			if (filePath.match(config.compress)) {
				rs = compress(rs, req, res);
			}
			rs.pipe(res)

		} else if(stats.isDirectory()) {
			const files = await readdir(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			const dir = path.relative(config.root, filePath);//相对于当前文件的路径
			const data = {
				title: path.basename(filePath),//文件绝对路径
				dir: dir ? `/${dir}` : '',//相对于根路径
				files: files.map(file => {
					return {
						file,
						icon: mime(file)
					}
				})
			}
			console.log(files)
			res.end(template(data));


			// fs.readdir(filePath, (err, files) => {
			// 	res.statusCode = 200;
			// 	res.setHeader('Content-Type', 'text/plain');
			// 	res.end(files.join(","));
			// });
			
		}
	} catch(ex) {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory or file`);
	}
}