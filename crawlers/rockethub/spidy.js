var cheerio  = require("cheerio"),
	request  = require("request"),
		 fs  = require("fs"),
	base_url = "http://www.rockethub.com/projects/live?page=",
	proj_url = "http://www.rockethub.com";

function TotalPages(err, res, html) {
	if(err) {throw err;}
	var data = cheerio.load(html);
	var last = data(".last a").attr("href");
		last = last.split("");
	var lp = [];

	//console.log(last.length);
	//last = "/projects/live?page=99";
	//last = last.split("");
	//console.log(last);
	//console.log(last.length);
	
	if(last.length === 22) {
		lp.push(last[20]);
		lp.push(last[21]);
	} else {
		lp.push(last[20]);
		lp.push(last[21]);
		lp.push(last[22]);
	}
	lp = lp.join("");
	IterateRequests(lp); // pass total pages to iteration fxn
	
} // end Fetch

request("http://www.rockethub.com/projects/live", TotalPages);
console.log("initial request");

function IterateRequests(times) {
	var links = [];
	for(var i = 1; i <= times; i++) {
		request(base_url+i, TestTime);
		//console.log(base_url+i);
	}
	//console.log(links.length);
} // end IterateRequests

// 9 PROJECTS PER PAGE

function TestTime(err, res, html) {
	if(err) {throw err;}
	var data = cheerio.load(html);
	var proj = data(".project-box").html();
	//console.log(proj);
	for(var i = 0; i < 9; i++) {

		var time = data(".days-left-label").eq(i).text().trim();
		time = time.split(" ");
		time = time[0];
		//console.log(time);
		//console.log(testText(time));
		var hrs = data(".days-left-count").eq(i).text().trim();
		//cconsole.log(hrs);
		//console.log(testNum(hrs));
		if(testText(time) && testNum(hrs)) {
			//console.log("get link");
			//console.log(time);
			//console.log(hrs-1);
			//var url = data(".days-left-count").prev().prev().attr("href");
			var url = data(".overlay").eq(i).children().first().attr("href");
			url = proj_url+url;
			//console.log(url);
			/*
			var content = fs.readFileSync("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/hub/pjs.txt", "utf-8");
			content = content.split("\n");

			if(content.indexOf(url) === -1) {
				fs.appendFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/hub/pjs.txt", url+"\n", function(err) {
					if(err) {throw err;}
				}); // end appendFile
				console.log("appended:  "+url);
			}	
			*/
		} // end time / num constraint test

	} // end page for loop
	
} // end TestTime 

//request(base_url+1, TestTime);
console.log("tt request initiated");

function testText(text) {
	if(text === "Hrs") {
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