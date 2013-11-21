var Query = require('./query/query').Query,
		query = new Query();

var numRequests = 66;
//query.crawlCB(numRequests);
		
var Api = require('./api/api').Api,
		api = new Api();

var data = api.fetchJSON();
api.goCrawl(data);
//console.log(data);
//api.log('hi friend');


