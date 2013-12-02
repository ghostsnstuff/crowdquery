// global object
// used to interact with crawling and transforming api hrefs into accessible data
var Api = function() {};

// localApi instance used for internal fxn usage
var localApi = new Api();

// prints data to console
Api.prototype.printData = function(data);

// prints json file containing api hrefs for query=crowdfunding results
Api.prototype.readJSON = function();

// synchronous read 'query.json'
// contains name, type, href to profile page
// returns an array of jsons
Api.prototype.fetchJSON = function();

// returns value associated with key for given json
Api.prototype.fetchKeyValue = function(json, key);

// iterates through array of jsons from 'query.json'
// fetches profile href
// profile href passed to request()
// callback fxn crawl passed to request as well
Api.prototype.goCrawl = function(array);

// callback fxn for request
// loads rawData via cheerio module
// calls fetchDataLinks(rawData)
// calls apiMatch(links)
// calls addJSON(api)
// increments crawlCOUNT
// when crawlCOUNT equals total # of requests to make
// bigJSON containing json of api hrefs is written to 'api.json'
Api.prototype.crawl = function(err, res, html);

// extracts all possible hrefs for api href on profile page
// returns array of all possible values 
Api.prototype.fetchDataLinks = function(data);

// each page only has one api href
// and b/c each api href ends with '.js'
// the last 3 char positions of each href are examined
// the href that has the ending '.js' is appended to base_url
// the resulting href is returned
Api.prototype.apiMatch = function(hrefs);

// creates tempJSON
// appends data to tempJSON.api
// adds tempJSON to bigJSON
// increments jsonCOUNT
Api.prototype.addJSON = function(data);

// stringifies data into json format
// writes result to 'api.json'
Api.prototype.wirteJSON = function(data);

