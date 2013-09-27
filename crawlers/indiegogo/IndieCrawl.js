var cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	tp_url = "http://www.indiegogo.com/projects?utf8=✓&filter_city=&filter_country=&filter_quick=countdown&filter_location=&commit=Submit",
	base_url = "http://www.indiegogo.com/projects?commit=Submit&filter_city=&filter_country=&filter_location=&filter_quick=countdown&pg_num=";

function tpCrawl(err, res, html) {
	if(err) {throw err;}		
	var data = cheerio.load(html);						// load html
	var tp = data(".browse_pagination a").eq(4).text(); // extract tp
	//console.log(tp);
	IterateRequests(tp);								// iterate requests
} // end Crawl

request(tp_url, tpCrawl); 								// initial request
console.log("tp request initiated");

function IterateRequests(times) {
	var links = [];
	for(var i = 1; i < times; i++) {
		var link = request(base_url+i, TestTime);
		links.push(link);
	}
	console.log(links.length);
} // end IterateRequests

function TestTime(err, res, html) {
	var data = cheerio.load(html);
	var urls = [];
	
	for(var j = 0; j < 9; j++) {

		var res1 = [];
		var res2 = [];
		var res3 = [];
		var left = ["l","e","f","t"];
		var tNum = [];
		var tString= [];
		
		var times = data("#time_left").eq(j).text().split("");

		for(var i = 0; i < times.length; i++) {
			if(times[i] != " ") {
				res1.push(times[i]);
			}
		}
		for(var i = 0; i < res1.length; i++) {
			if(res1[i] != "\n") {
				res2.push(res1[i]);
			}
		}
		for(var i = 0; i < res2.length; i++) {
			if(left.indexOf(res2[i]) === -1) {
				res3.push(res2[i]);
			}
		}
		//console.log(res3);

		for(var i = 0; i < res3.length; i++) {
			if(isNaN(res3[i])) {
				tString.push(res3[i]); 
			} else {
				tNum.push(res3[i]);
			}
		}
	
		tString = tString.join("");
		//console.log(tString);
		
		tNum = tNum.join("");
		//console.log(tNum);
		
		//console.log("hours "+testText(tString));
		//console.log("num   "+testNum(tNum));
		

		if(testText(tString) && testNum(tNum)) {
			//console.log("j  "+j);
			if(j === 0) {
				var tp = data(".project-details a").eq(j).attr("href"); // extract project initial link
				tp = "http://indiegogo.com"+tp;
				//console.log(tp);

				var content = fs.readFileSync("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/indie/pjs.txt", "utf-8");
				content = content.split("\n");

				if(content.indexOf(tp) === -1) {
					fs.appendFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/indie/pjs.txt", tp+"\n", function(err) {
						if(err) {throw err;}
					}); // end appendFile
					console.log(tp);
				}	
				urls.push(tp);
			} else {

				var tp = data(".project-details a").eq(j*3).attr("href"); // extract project links (where j > 1)
				tp = "http://indiegogo.com"+tp;
				//console.log(tp);

				var content = fs.readFileSync("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/indie/pjs.txt", "utf-8");
				content = content.split("\n");

				if(content.indexOf(tp) === -1) {
					fs.appendFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/indie/pjs.txt", tp+"\n", function(err) {
						if(err) {throw err;}
					}); // end appendFile
					console.log(tp);
				}
				urls.push(tp);
			}	
		} // end 24 hr link constraint-extraction


		// iterate & log urls
		for(var i = 0; i < urls.length; i++) {
			//console.log(urls[i]);
				
		} // end time / num constraint test
		//console.log(urls[i]);

	} // end page loop


} // end TestTime

//request(base_url+3, TestTime);
//console.log("hrs request initiated");


function testText(text) {
	if(text == "hours") {
		return true;
	} else {
		return false;
	}
}

//console.log(testText("hours"));
//console.log(testText("days"));


function testNum(num) {
	if(num <= 24) {
		return true;
	} else {
		return false;
	}
}

//console.log(testNum(24));
//console.log(testNum(2));