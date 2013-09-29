var url = "http://www.kickstarter.com/help/stats",
	request = require("request"),
	headers = [],
	totals = [],
	dataCells = [],
	cheerio = require("cheerio");
var ksStats = {"stats": [
	{"category":"Games"}, 
	{"category":"Film & Video"},
	{"category":"Design"},
	{"category":"Music"},
	{"category":"Technology"},
	{"category":"Publishing"},
	{"category":"Art"},
	{"category":"Food"},
	{"category":"Comics"},
	{"category":"Fashion"},
	{"category":"Theater"},
	{"category":"Photography"},
	{"category":"Dance"}
]}

/*
var test = "works";
ksStats.stats[0][test] = "stuff";
console.log(ksStats.stats[0]);
*/


function headerCrawl(err, res, html) {
	var data = cheerio.load(html);

	for(var i=0; i<24; i++) {
		var result = data(".header th").eq(i).text().trim();
		headers.push(result);
	}

/*
	for(var i=0; i<headers.length; i++) 
		console.log(headers[i] + "\t\t works damn uze!\n");
*/
}

function totalsCrawl(err, res, html) {
	var data = cheerio.load(html);

	for(var i=0; i<24; i++) {
		var result = data(".site_wide td").eq(i).text().trim();
		totals.push(result);
	}

/*
	for(var i=0; i<totals.length; i++)
		console.log(totals[i] + "\t works damn uze!\n");
*/
}

function dataCrawl(err, res, html) {
	var data = cheerio.load(html);
	var category;
	var index;
	var propertyIndex;
	var property;

	for(var i=0; i<24; i++) {
		var headerResult = data(".header th").eq(i).text().trim();
		headers.push(headerResult);
	}

	for(var i=0; i<13*8*3; i++) {
		var result = data(".category_row td").eq(i).text().trim();

		if(i%8 === 0){
			category = result;
			for(var j=0; j<13; j++){
				if (ksStats.stats[j].category === category) {
					index = j;
					break;
				}
			}
		}

		else {

			propertyIndex = i%8;
			if (i>8*13)
				propertyIndex += 8;
			if (i>2*8*13)
				propertyIndex += 8;
			property = headers[propertyIndex];
			//console.log(property);
			ksStats.stats[j][property] = result;
		}
			
		
	}

	for(var i=0; i<13; i++) {
		console.log(ksStats.stats[i]);
	}


}


//request(url, headerCrawl);
request(url, totalsCrawl);
request(url, dataCrawl);
