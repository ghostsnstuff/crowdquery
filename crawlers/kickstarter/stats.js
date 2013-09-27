var request = require("request"),
	cheerio = require("cheerio"),
	fs      = require("fs"),
	url     = "http://www.kickstarter.com/help/stats?ref=footer";

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
}; // end remove

// console each array element
function PrintElements(array) {
	for(var i = 0; i < array.length; i++) {
		console.log(array[i]);
	}
} // end PrintElements

function AddDecimal(array) {
	var result = array.split("");
	for(var i = 0; i < result.length; i++) {
		if(i === 2) {
			result[4] = result[3];
			result[3] = result[2];
			result[2] = ".";
		}
	}
	return result.join("");
} // end AddDecimal

function Parser(array) {

	var result = [];
	for(var i = 0; i < array.length; i++) {
		var num = parseInt(array[i], 10);
		switch(num) {
			case(0):result.push(num);
			break;
			case(1):result.push(num);
			break
			case(2):result.push(num);
			break;
			case(3):result.push(num);
			break;
			case(4):result.push(num);
			break;
			case(5):result.push(num);
			break;
			case(6):result.push(num);
			break;
			case(7):result.push(num);
			break;
			case(8):result.push(num);
			break;
			case(9):result.push(num);
			break;
		} // end switch
	} // end for
	result = result.join("");
	return result;

} // end Parser

function FetchCategory(data, n1, n2, n3, n4, n5, n6, n7, n8) {

	var array = [];
	array[0] = data("#projects_and_dollars tbody tr td").eq(n1).text().trim(); // title
	//console.log(array[0]);

	array[1] = data("#projects_and_dollars tbody tr td").eq(n2).attr("data-table-value"); // launched_projects
	//console.log(array[1]);
	//console.log(Number.isNaN(array[1]));

	array[2] = data("#projects_and_dollars tbody tr td").eq(n3).attr("data-table-value"); // total_money
	array[2] = parseInt(array[2], 10).toFixed();
	//console.log(array[2]);
	//console.log(!Number.isNaN(array[2]));

	array[3] = data("#projects_and_dollars tbody tr td").eq(n4).attr("data-table-value"); // successful_money
	array[3] = parseInt(array[3], 10).toFixed();
	//console.log(array[3]);
	//console.log(Number.isNaN(array[3]));

	array[4] = data("#projects_and_dollars tbody tr td").eq(n5).attr("data-table-value"); // unsuccessful_money
	array[4] = parseInt(array[4], 10).toFixed();
	//console.log(array[4]);
	//console.log(Number.isNaN(array[4]));

	array[5] = data("#projects_and_dollars tbody tr td").eq(n6).attr("data-table-value"); // live_money
	array[5] = parseInt(array[5], 10).toFixed();
	//console.log(array[5]);
	//console.log(Number.isNaN(array[5]));

	array[6] = data("#projects_and_dollars tbody tr td").eq(n7).attr("data-table-value"); // live_projects
	array[6] = parseInt(array[6], 10).toFixed();
	//console.log(array[6]);
	//console.log(Number.isNaN(array[6]));

	array[7] = data("#projects_and_dollars tbody tr td").eq(n8).attr("data-table-value"); // success_rate
	array[7] = array[7]*100;
	array[7] = parseFloat(array[7]).toFixed(2);
	//array[7] = AddDecimal(array[7]);
	//console.log(array[7]);
	//console.log(Number.isNaN(array[7]));
	return array; 

} // end FetchCategory

function FetchBasics(data) {

	var array = [];
	var totals = data(".total .col h1").text().split("n");  // dollar and project totals
	var res1 = Parser(totals[0]);						    // console.log("total dollars:   "+res1+" M");
	var res2 = Parser(totals[1]); 			     		    // console.log("funded projects: "+res2);
	var res3 =  Parser(data(".col h3").eq(0).text());	    // console.log("total backers:   "+res3);
	var res4 = Parser(data(".col h3").eq(1).text());        // console.log("repeat backers:  "+res4);
	var res5 = Parser(data(".col h3").eq(2).text());	    // console.log("total pledges:   "+res5);
	array.push(res1,res2,res3,res4,res5);
	return array;

} // end FetchBasics

function Write(array) {

	var titles = array[0];
	console.log(titles);
	fs.writeFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/stats/data.csv", titles, 
		function(err) {
			if(err) {throw err;}
			console.log("done writing");
		}); // end writeFile
	Append(array);

} // end Write

function Append(array) {
	var text;
	for(var i = 0; i < array.length; i++) {
		text = "\n"+array[i];
		fs.appendFile("/Users/jaredhalpert/Desktop/Sublime/nodejs/scraping/stats/data.csv", text, 
			function(err) {	
				if(err) {throw err;}
			}); // end appendFile
		console.log(i+" "+array[i]/*+" appended"*/);
		if(i === array.length) {
			console.log("done appending");
		}
	}
} // end Append

function Spider(err, res, html) {

	if(err) {throw err;}
	
	var data = cheerio.load(html);  // entire data set

	var basics = FetchBasics(data); // array : total dollars, backers, pledges, repeat backers, funded projects

	// project and dollars data extraction
	var titles = ["Category", "LaunchedProjects", "TotalDollars","SuccessfulDollars", "UnsuccessfulDollars","LiveDollars", "LiveProjects", "SuccessRate"];
	
	// GRAB AGGREGATE DATA
	var all = [];
	all[0] = data(".site_wide td").eq(0).text().trim(); //console.log(all[0]);

	all[1] = data(".site_wide td").eq(1).text().trim(); // launched_projects
														// console.log(all[1]);
	all[1] = Parser(all[1]);							// console.log(all[1]);

	all[2] = data(".site_wide td").eq(2).text().trim(); // total_money
														// console.log(all[2]);
	all[2] = Parser(all[2]);							// console.log(all[2]);
			
	all[3] = data(".site_wide td").eq(3).text().trim(); // successful_money
														// console.log(all[3]);
	all[3] = Parser(all[3]);							// console.log(all[3]);

	all[4] = data(".site_wide td").eq(4).text().trim(); // unsuccessful_money
														// console.log(all[4]);
	all[4] = Parser(all[4]);							// console.log(all[4]);
	
	all[5] = data(".site_wide td").eq(5).text().trim(); // live_money
														// console.log(all[5]);
	all[5] = Parser(all[5]);							// console.log(all[5]);
	
	all[6] = data(".site_wide td").eq(6).text().trim(); // live_projects
														// console.log(all[6]);
	all[6] = Parser(all[6]);							// console.log(all[6]);

	all[7] = data(".site_wide td").eq(7).text().trim(); // success_rate
														// console.log(all[7]);
	all[7] = Parser(all[7]);							// console.log(all[7]);
	
	//console.log(all); // print all array

	// FETCH CATEGORY DATA
	var film    = FetchCategory(data,0,1,2,3,4,5,6,7);               // film
	var games   = FetchCategory(data,8,9,10,11,12,13,14,15);         // games
	var design  = FetchCategory(data,16,17,18,19,20,21,22,23);       // design
	var music   = FetchCategory(data,24,25,26,27,28,29,30,31);       // music
	var tech    = FetchCategory(data,32,33,34,35,36,37,38,39);       // tech     
	var pub     = FetchCategory(data,40,41,42,43,44,45,46,47);       // pub
	var art     = FetchCategory(data,48,49,50,51,52,53,54,55);       // art
	var food    = FetchCategory(data,56,57,58,59,60,61,62,63);       // food     
	var comics  = FetchCategory(data,64,65,66,67,68,69,70,71);       // comics
	var fashion = FetchCategory(data,72,73,74,75,76,77,78,79);       // fashion
	var theater = FetchCategory(data,80,81,82,83,84,85,86,87);       // theater
	var photo   = FetchCategory(data,88,89,90,91,92,93,94,95);       // photo
	var dance   = FetchCategory(data,96,97,98,99,100,101,102,103);   // dance

	var array = [];
	array.push(titles,basics,all,film,games,design,music,tech,pub,art,food,comics,fashion,theater,photo,dance); 

	// TESTING
	// console.log(film);
	// console.log(games);
	// console.log(design);
	// console.log(music);
	// console.log(tech);
	// console.log(pub);
	// console.log(art);
	// console.log(food);
	// console.log(comics);
	// console.log(fashion);
	// console.log(theater);
	// console.log(photo);
	// console.log(dance);
	// console.log(array);

	Write(array);

}
console.log("requesting url - preparing to extract data");
request(url, Spider);