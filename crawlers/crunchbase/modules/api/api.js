var cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs');

var api_url1 = 'http://api.crunchbase.com',
    api_key = '?api_key=9tnkpa2fdm7mf4ef2ubsazwy';

var Api = function() {};
var localApi = new Api();
exports.Api = Api;

Api.prototype.printData = function(data) {
	console.log(data);
}
var bigJSON = [],
    jsonCOUNT = 0,
    crawlCOUNT = 1;		

Api.prototype.readJSON = function() {
	fs.readFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/api/api.json', function(err, data) {
		if(err) {throw err;}
		var json = JSON.parse(data.toString());
		console.log(json);
	});
}

Api.prototype.fetchJSON = function() {
	var data = fs.readFileSync('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/query/query.json', 'utf-8');
	data = data.toString();
	data = JSON.parse(data);
	return data;
}

Api.prototype.fetchKeyValue = function(json, key) {
	for(var data in json) {
	   if(data === key) {
		return json[data];
	   }
	}
}

Api.prototype.goCrawl = function(array) {
	for(var i = 0; i < array.length; i++) {
	    var tempHREF = localApi.fetchKeyValue(array[i], 'href');
	    request(tempHREF, localApi.crawl);		
	}
}

Api.prototype.crawl = function(err, res, html) {
	var rawData = cheerio.load(html);
	var links = localApi.fetchDataLinks(rawData);
	var api = localApi.apiMatch(links);
	localApi.addJSON(api);
	crawlCOUNT++;
	if(crawlCOUNT === 450) {
	   console.log('writing bigJSON');
	   localApi.writeJSON(bigJSON);
	}
}

Api.prototype.fetchDataLinks = function(data) {
	var links = [];
	var moreLinks = true;
	var k = 0;
	while(moreLinks) {
		var api_link = data('.col3_content a').eq(k).attr('href');
		if(api_link == undefined) {
		   moreLinks = false;
		} else {
		   links.push(api_link);
		}
		k++;
	}
	return links;
}

Api.prototype.apiMatch = function(hrefs) {
	for(var i = 0; i < hrefs.length; i++) {
		var curr_href = hrefs[i],
		    one = curr_href[curr_href.length-1],
		    two = curr_href[curr_href.length-2],
		    three = curr_href[curr_href.length-3],
		    temp_match = three+two+one;
		if(temp_match == '.js') {
		    api_match = curr_href;
		    api_match = api_url1 + api_match + api_key;	
		    return api_match;
		}
	}
}

Api.prototype.addJSON = function(data) {
	var tempJSON = {};
	tempJSON.api = data;
	bigJSON[jsonCOUNT] = tempJSON;
	jsonCOUNT++;
}

Api.prototype.writeJSON = function(data) {
	var finalJSON = JSON.stringify(data);
	fs.writeFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/api/api.json', finalJSON, function(err) {
		if(err) {throw err;}
	});
}

