// global object declaration
var Query = function() {};

// localQuery instance used for internal fxn usage
var localQuery = new Query();

// prints data from 'query.json'
// each individual json contains name, type, profile href
Query.prototype.readJSON = function();

// synchronous read 'query.json'
// returns an array of jsons
Query.prototype.fetchJSON = function();

// control flow fxn
// calls makeRequests(pages)
Query.prototype.crawlCB = function(pages);

// crawls through total number of pages to request
// url manipulation happens in the middle of the url
// url and callback fxn crawl are passed to request()
Query.prototype.makeRequests = function(pages);

// iterates through each individual page result
// examines 7 results per page, last page varies
// extracts name, type and profile href
// if profile href != undefined
// then data for each result is appended to tempJSON
// each tempJSON is added to bigJSON
// numJSON is incremented 
// on last page, and on last possible page item iteration 
// -> finalJSON is written to 'query.json'
Query.prototype.crawlPage = function(err, res, html);