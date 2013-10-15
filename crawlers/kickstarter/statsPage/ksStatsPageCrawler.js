/************************************************

	Creates a json with each category of kickstarter
	project.  Crawls the kickstarter stats page, collecting
	data for each category and adding it to the json.
	Finally the json is printed to the ksStatsPageData file
	and to the console.

************************************************/

//Global variables and required modules
var url = "http://www.kickstarter.com/help/stats",
	request = require("request"),
	headers = [],
	totals = [],
	dataCells = [],
	cheerio = require("cheerio"),
	fs = require("fs");

//Time and date of the current crawl
var date = new Date();

//json for the data being collected
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
	{"category":"Dance"},
	{"Date":date}
]}

//function that does all the work
function dataCrawl(err, res, html) {
	var data = cheerio.load(html); 	//loads the html to be crawled
	var category; 		      	//holds the category to be worked on
	var propertyIndex;		//holds the index of the header we are looking at
	var property;			//will hold the property to be added to our json

	//collects all the data headers from the stats page and
	// pushes them to the header array for later use
	for(var i=0; i<24; i++) {
		var headerResult = data(".header th").eq(i).text().trim();
		headers.push(headerResult.replace("\n\n",' ').replace('\n',' '));
	}

	//loop that matches our data, headers, and categories to be
	// placed in the json
	for(var i=0; i<13*8*3; i++) {
		//the current data cell of the tables in this iteration of the loop
		var result = data(".category_row td").eq(i).text().trim();

		//if the current iteration of the loop is a multiple of 8
		// then the data cell is a category name and so we set the 
		// category variable to the value of the current data cell
		if(i%8 === 0){
			category = result;	//sets category to the current data cell

			//loop sets j to the json index of the current category
			for(var j=0; j<13; j++){
				if (ksStats.stats[j].category === category) {
					break;
				}
			}
		}

		//when the loop iteration is not a multiple of 8 we have new data
		// to add to our json
		else {
			//sets the property index to the appropriate collumn
			propertyIndex = i%8;
			//keeping the same collumn, moves to the next table if appropriate
			if (i>8*13)
				propertyIndex += 8;		
			//keeping the same collumn, moves to the next table if appropriate
			if (i>2*8*13)
				propertyIndex += 8;

			//sets property to the appropraite header of the header array
			property = headers[propertyIndex].replace("\n"," ");
			//adds to the current category the property of the current data cell
			// with the value of the current data cell
			ksStats.stats[j][property] = result.replace(',','');
		}
			
		
	}

/*
	//prints the data filled json to the ksStatsPageData
	fs.appendFile("ksStatsPageData", JSON.stringify(ksStats)+"\n\n", function(err) {
		if(err){throw err;}
	});
*/
	fs.appendFile("ksStatsPageData", "[\n", function(err) {
		if(err){throw err;}
	});
	//prints the data from the json to the console
	for(var i=1; i<14; i++) {
		console.log(ksStats.stats[i]);
		fs.appendFile("ksStatsPageData", JSON.stringify(ksStats.stats[i]) + "\n", function(err) {
			if(err) {throw err;}
		});
	}

	fs.appendFile("ksStatsPageData", "]\n", function(err) {
		if(err){throw err;}
	});

}

//Start of the program
request(url, dataCrawl);
