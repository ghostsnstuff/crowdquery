/*

PROGRAM FLOW

	1. call IteratePageRequests() to make 'x' # of page requests => based on parameter
	2. acknowledge request
	3. IteratePageRequests() appends page number to base_url for indiviual page Crawls 'n' times
	4. CrawlPage() loads html via 'cheerio'
	5. GetUrl() extracts 15 sets of project data per page
	6. GetUrl() returns an array of project links
	7. exec() #1 compiles count.cpp which counts the # of projects
	8. between indie, ks, and rockethub
	9. exec() #2 opens the count.cpp file => displays total # of projects

PRIMARY MODULES & VARS

	1. load modules
	2. define base url 
	3. 'base_url' for appending page # to, specifies unique page request
	4. 'cheerio' use to extract specific html data
	5. 'underscore' => use of contains() to check absence of newly fetched links
	6. 'fs' used to read & write to 'pjs.txt'
	7. 'child_process' sends commands to terminal => to compile & open 'count.cpp' 
	8. 'exec' => fxn executes terminal commands 

*/

var base_url = "http://www.kickstarter.com/discover/ending-soon?page=",
    request  = require("request"),
    cheerio  = require("cheerio"),
    under    = require("underscore"),
    fs       = require("fs"),
    child    = require("child_process"),
    exec     = child.exec;

function PrintElements(array) {
	for(var i = 0; i < array.length; i++) {
		console.log(i+1+" "+array[i]);
	}
} // end PrintElements

function GetProjectUrls(data, n) {
	var times = n;
	var array = [];
	var url;
	for(var i = 0; i < times; i++) {
		url = data(".project-thumbnail a").eq(i).attr("href");
		url = "http://www.kickstarter.com"+url;
		array.push(url);
	}
	return array;
} // end GetUrl

function CrawlPage(err, res, html) {

	if(err) {throw err;}

	var data = cheerio.load(html);
	var urls = GetProjectUrls(data, 15);

	var iFile = fs.readFileSync("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/ks/txt/pjs.txt", "utf-8");
	iFile = iFile.split("\n");

	for(var i = 0; i < urls.length; i++) {
		
		var counter = 0;
		var val = urls[i];
		var ans = under.contains(iFile, val);
		var ind = under.indexOf(iFile, val);

		if(!ans) {
			fs.appendFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/ks/txt/pjs.txt", val+"\n", function(err) {
				if(err) {throw err;}
			});
		}
		console.log(urls[i]);
		/*
		if(i === 14) {
			console.log(urls[i]+"\n");	
		} else {
			console.log(urls[i]);	
		}		
		*/
		//console.log(i+"  "+iFile.length);
	}


} // end crawl

function IteratePageRequests(n) {
	for(var i = 1; i < n; i++) {
		request(base_url+i, CrawlPage);
	} // end request loop
} // end Iterate

// 15 projects per page
// queue behavior 
IteratePageRequests(6);
console.log("request initiated");	
/*
exec("g++ /Users/jaredhalpert/Desktop/sublime/nodejs/scraping/soon/count.cpp -o count", function(err, stdout, stderr) {
	if(err) {throw err;}
	console.log(stdout);
}); // end compile exec()

exec("open count", function(err, stdout, stderr) {
	if(err) {throw err;}
	console.log(stdout);
}) // end open exec()
*/
