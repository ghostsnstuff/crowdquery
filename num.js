var request = require("request"),
	cheerio = require("cheerio"),
	url = "http://www.kickstarter.com/discover/ending-soon?ref=sidebar#p1";

function crawl(err, res, html) {
	if(err) {throw err;}
	var data = cheerio.load(html);
	var thing = data(".project-stats").eq(14).html();
	var other = cheerio.load(thing);
	var one = other("li").eq(3).attr("data-end_time");

	var date = new Date(one).getHours();
	var curr = new Date().getHours();

	var diff = date - curr;


	console.log(diff);
}

request(url, crawl);
