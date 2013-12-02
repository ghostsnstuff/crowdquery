var http = require('http'),
		fs = require('fs'),
		port = 3003;

// fxn fetches json prop value
function fetchProperty (json, property) {
	for(var key in json) {
		if(key === property) {
	 		return json[key];
	 	}	
	}
}

// read json file
// create an array using file content
var filename = '/Users/jaredhalpert/desktop/sublime/nodejs/scraping/stats/daily_totals.txt';
var array_jsons = fs.readFileSync(filename, 'utf-8');
array_jsons = array_jsons.split('\n');

// null case b/c empty line at end of file
// iterate array
// parse each element
// fetch 'dollars' property -> parseInt()
// compare returned values to input 
var input = 862, output;
for(var i = 0; i < array_jsons.length; i++) {
	var temp_json = JSON.parse(array_jsons[i] || null);
	if(temp_json != null) {
		output = parseInt(fetchProperty(temp_json, "dollars"), 10);
		if(output === input) {
			console.log(output);
			break;
		} 
	} 
}
console.log('final output: ' + output);

// create a server to send search result
http.createServer(function(req, res) {
	console.log('server open')
	res.end(output.toString());
	console.log('server closed')
}).listen(port);
console.log('server listening on port: ' + port);
