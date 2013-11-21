// modules and globals
var request = require('request'),
		cheerio = require('cheerio'),
		async = require('async'),
		fs = require('fs'),
		bigJSON = [],
		numJSON = 0,
		pageCount = 1,
		url1 = 'http://www.crunchbase.com/search?page=',
		url2 = '&query=crowdfunding',
		base_url = 'http://www.crunchbase.com';

// global object declaration
// localQuery used for internal fxn usage
var Query = function() {};
var localQuery = new Query();

// prints json data
Query.prototype.readJSON = function() {
	fs.readFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/query/query.json', function(err, data) {
		if(err) {throw err;}
		var json = JSON.parse(data.toString());
		console.log(json);
	});
}

// returns array of json data
Query.prototype.fetchJSON = function() {
	var data = fs.readFileSync('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/query/query.json', 'utf-8');
	data = data.toString();
	data = JSON.parse(data);
	return data;
}

// pages = # requests
Query.prototype.crawlCB = function(pages) {
	async.series([
		localQuery.makeRequest(pages)
	], function(err) {
		if(err) {throw err;}
	});
}

// iterate page requests
Query.prototype.makeRequest = function(pages) {
	for(var i = 1; i <= pages; i++) {
		request(url1+i+url2, localQuery.crawlPage);		
	}
}

// extract data from individual page
Query.prototype.crawlPage = function(err, res, html) {
	if(err) {throw err;}
	var data = cheerio.load(html);
	pageCount++;	
	for(var i = 0; i < 7; i++) {
		var	queryName = data('.search_result_name a').eq(i).text().toLowerCase(),
				queryType = data('.search_result_type').eq(i).text().trim().toLowerCase(),
				queryHref = data('.search_result_name a').eq(i).attr('href');
		if(queryHref != undefined) {
			queryHref = base_url+queryHref;
			var tempJSON = {};
			tempJSON.name = queryName;
			tempJSON.type = queryType;
			tempJSON.href = queryHref;
			bigJSON[numJSON] = tempJSON;
			numJSON++;
		}
		if(pageCount == 66 && i ==6) {
			var finalJSON = JSON.stringify(bigJSON);
			console.log('writing to file');
			fs.writeFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/query/query.json', finalJSON, function(err) {
				if(err) {throw err;}
			});
		}	
	}
}

console.log('request init');

exports.Query = Query;

// next time ...
// totalPageCount -> dynamic
// promises -> handle nested async flow?