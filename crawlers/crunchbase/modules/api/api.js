// modules
var cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs');

// api url attachments 
var api_url1 = 'http://api.crunchbase.com',
    api_key = '?api_key=9tnkpa2fdm7mf4ef2ubsazwy';

// global object declaration
var Api = function() {};

// localApi instance is used for internal fxn usage
var localApi = new Api();

// make object global
exports.Api = Api;

// prints input
Api.prototype.printData = function(data) {
   console.log(data);
}

// vars associated with creating jsons
// crawl count is used to indicate when to write to file
var bigJSON = [],
    jsonCOUNT = 0,
    crawlCOUNT = 1;		

// prints data in api.json 
Api.prototype.readJSON = function() {
   fs.readFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/api/api.json', function(err, data) {
      if(err) {throw err;}
      var json = JSON.parse(data.toString());
      console.log(json);
   });
}

// returns api.json as an array
Api.prototype.fetchJSON = function() {
    var data = fs.readFileSync('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/query/query.json', 'utf-8');
    data = data.toString();
    data = JSON.parse(data);
    return data;
}

// returns value assoicated with a given json key
Api.prototype.fetchKeyValue = function(json, key) {
   for(var data in json) {
      if(data === key) {
         return json[data];
      }
    }
}

// crawls each profile page, data from query.json
Api.prototype.goCrawl = function(array) {
    for(var i = 0; i < array.length; i++) {
       var tempHREF = localApi.fetchKeyValue(array[i], 'href');
       request(tempHREF, localApi.crawl);		
    }
}

// crawls profile page, fetches api href
// transforms data to nested json
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

// returns an array of all profile page hrefs
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

// finds api href match, returns result
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

// transforms data to nested json
Api.prototype.addJSON = function(data) {
   var tempJSON = {};
   tempJSON.api = data;
   bigJSON[jsonCOUNT] = tempJSON;
   jsonCOUNT++;
}

// writes nested json to api.json
Api.prototype.writeJSON = function(data) {
   var finalJSON = JSON.stringify(data);
   fs.writeFile('/Users/jaredhalpert/crowdquery/crawlers/crunchbase/modules/api/api.json', finalJSON, function(err) {
      if(err) {throw err;}
   });
}

