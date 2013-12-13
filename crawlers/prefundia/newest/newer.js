var request = require('request'),
		cheerio = require('cheerio'),
		mongoose = require('mongoose'),
		prefundia = require('./schema').PrefundiaProject;
		q = require('q'),
		new_url = 'http://prefundia.com/projects/newest/';


function makeRequest() {
	var deferred = q.defer();
	request.get(new_url, function(err, req) {
		if(err) {throw err;}
		deferred.resolve(req.body);
	})
	return deferred.promise;
}

function extractData(data) {
	console.log('extracting');
	var array = [];
	var deferred = q.defer();
	data = cheerio.load(data);
	
	data('a').each(function(i, e) {
		
		var a = data(this).attr('href'),
				t = data(this).attr('title');

		var tempJSON = {};
		
		if(isProjectLink(a)) {

			tempJSON.title = t;
			tempJSON.href = a;
			array.push(tempJSON);

			/*
			console.log('creating');
		
			var tempPROJECT = new prefundia({
				project_title: t,
				project_href: a
			});
		
			tempPROJECT.save(function(err, data) {
				if(err) {throw err;}
				console.log('writing');
			});
*/
		
		}

	})

	deferred.resolve(array);
	return deferred.promise;
}

function printData(data) {
	console.log(data);
}

function isProjectLink(data) {
	data = data.split('');
	var chunk = '';
	for(var i = 0; i < 29; i++) {
		chunk += data[i];
	}
	//'http://prefundia.com/projects/view/the-zip-tie/280/'

	if(chunk === 'http://prefundia.com/projects') {
		return true;
	} else {
		return false;
	}

}

makeRequest().then(extractData).then(printData);


/*
function openDB() {
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'error connection:'));
	db.on('open', function() {
		console.log('db open');
	});
	makeRequest().then(extractData).then(printData);
}

openDB();
*/
