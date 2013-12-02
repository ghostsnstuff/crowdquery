// Query module
var Query = require('./query/query').Query,
    query = new Query();

// initial crawl
var numRequests = 66;
query.crawlCB(numRequests);
<<<<<<< HEAD
		
=======

>>>>>>> a9b80a03b089de756f411efed8f3c1d434f8aa60
// Api module
var Api = require('./api/api').Api,
    api = new Api();

<<<<<<< HEAD
// fetch array of query.json from initial crawl
var data = query.fetchJSON();

// crawl api hrefs
api.goCrawl(data);

// consolidate query.json and api.json
var queryJSON = query.fetchJSON();
var apiJSON = api.fetchJSON();
=======
// fetch array of json from initial crawl
var data = api.fetchJSON();

// crawl api hrefs
api.goCrawl(data);
>>>>>>> a9b80a03b089de756f411efed8f3c1d434f8aa60

