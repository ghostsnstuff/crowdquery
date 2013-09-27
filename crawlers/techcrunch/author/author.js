var request      = require("request"),
	cheerio      = require("cheerio"),
	under        = require("underscore"),
	base_url     = "http://techcrunch.com/tag/kickstarter/page/0",
	AuthorsArray = [],
	UniqAuthors  = [],
	rCount       = 0,
	n            = 30,
	authorJSON   = {},
	aJSON;

function CrawlAuthors(err, res, html) {

	rCount++;
	if(err) {throw err;}
	var data   = cheerio.load(html);
	
	for(var i = 0; i < n; i++) {
		var author = data(".by-line span").eq(i).text();
		if(author != "") {
			AuthorsArray.push(author);
		}
			
	}
	if(rCount === 11) {

		UniqAuthors = under.uniq(AuthorsArray);
		var aLength = AuthorsArray.length;

		console.log(aLength);
		console.log(UniqAuthors.length);
		//console.log(UniqAuthors);

		for(var j = 0; j < UniqAuthors.length; j++) {
			
			var aCount = 0;
			var aPercent = 0;

			for(var k = 0; k < AuthorsArray.length; k++) {
				
				if(AuthorsArray[k] === UniqAuthors[j]) {
					aCount++;
				}

			}
			aPercent = ((aCount/aLength) * 100).toFixed(1);
			
			authorJSON.author  = UniqAuthors[j];
			authorJSON.count   = aCount;
			authorJSON.percent = aPercent;

			aJSON = JSON.stringify(authorJSON);
			console.log(aJSON);
			//console.log(UniqAuthors[j]," ",aCount," ", aPercent);
		}
		
	}
		
}

for(var i = 1; i <= 10; i++) {
	request(base_url, CrawlAuthors);	
}
request(base_url+11, CrawlAuthors);
console.log("author request initiated");