var fs = require('fs');
var http = require('http');


http.createServer(function(req, res) {
	var filename = "/Users/jaredhalpert/Desktop/sublime/nodejs/scraping/stats/daily_totals.txt";
	var readStream = fs.createReadStream(filename);
	readStream.on('open', function() {
		readStream.pipe(res);
	});
	readStream.on('error', function() {
		res.end(err);
	});
}).listen(3002);
