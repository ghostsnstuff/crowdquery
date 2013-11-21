// Query module
var Query = require('./query/query').Query,
    query = new Query();

// initial crawl
var numRequests = 66;
query.crawlCB(numRequests);

// Api module
var Api = require('./api/api').Api,
    api = new Api();

// fetch array of json from initial crawl
var data = api.fetchJSON();

// crawl api hrefs
api.goCrawl(data);

