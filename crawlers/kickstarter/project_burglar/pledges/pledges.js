/*
 to do:
 update fetchLimitedData()
 limited pledges = limited pledges + sold out pledges
*/

var cheerio = require('cheerio'),
    q = require('q');

var Pledges = function() {};

Pledges.prototype.fetchPledges = function(data, projectJSON, totalBackers) {

	var pledgeJSON = {};
	var i = 0;
	
	var numPledges = data('.NS-projects-rightcol-rewards').attr('data-reward-count');
	pledgeJSON.num_pledges = numPledges;

	var numLimited = fetchNumLimit(data);
	if(numLimited > 0) {
		pledgeJSON.limited_pledges = true;
	} else {
		pledgeJSON.limited_pledges = false;
	}
	pledgeJSON.num_limited = numLimited;
	
	var numSoldOut = fetchNumSoldOut(data);
	pledgeJSON.num_sold_out = numSoldOut;

	var percentLimited = parseFloat(numLimited/numPledges*100).toFixed(2);
	pledgeJSON.percent_limited = percentLimited;

	var percentSoldOut = parseFloat(numSoldOut/numPledges*100).toFixed(2);
	pledgeJSON.percent_sold_out = percentSoldOut;

	var pledgeTypeJSON = {};
	
	for(var i = 0; i < numPledges; i++) {
		var tempJSON = {};

		var rawAmounts = data('.NS-projects-rightcol-rewards h5 span').eq(i).text().trim().replace(/,/g, '').split('$');
		var pledgeAmount;
		if(rawAmounts[1] != '') {
			pledgeAmount = rawAmounts[1];
		}
		tempJSON.pledge_amount = pledgeAmount;
		
		
		var rawBackers = data('.NS-projects-rightcol-rewards .num-backers').eq(i).text().trim().split(' ');
		var numBackers = rawBackers[0];
		tempJSON.num_backers = numBackers;

		var pledgePercentage = (parseFloat(numBackers/totalBackers)*100).toFixed(2);
		tempJSON.pledge_percentage = pledgePercentage;

		var rawDeliveryDate = data('.delivery-date').eq(i).text().replace(/\n/g, '').split(':')
		var deliveryDate = rawDeliveryDate[1].split(' ');
		var deliveryMonth = deliveryDate[0];
		var deliveryYear = deliveryDate[1];
		tempJSON.estimated_delivery_month = deliveryMonth;
		tempJSON.estimated_delivery_year = deliveryYear;

		var rawDescription = data('.NS-projects-rightcol-rewards .small_type').eq(i).text().split(' ');
		var numWords = rawDescription.length;
		tempJSON.num_words = numWords;


		var numAllCaps = fetchNumAllCaps(rawDescription);
		tempJSON.num_all_caps = numAllCaps;

		var chunk = data('.backers-wrap').eq(i).html();
		fetchLimitedData(chunk, tempJSON);
		
		var allCapWords = fetchAllCapWords(rawDescription);
		tempJSON.all_cap_words = allCapWords;

		pledgeTypeJSON[i] = JSON.stringify(tempJSON);
	
	}
	pledgeJSON.pledge_types = pledgeTypeJSON;
	
	// estimated delivery -> time between estimation and end date
	projectJSON.pledges = pledgeJSON;
	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;
}

function fetchNumAllCaps(array) {
	var count = 0;
	for(var i = 0; i < array.length; i++) {
		var string = array[i].toString();
		var regex = /\b[A-Z]+\b/;
		if(string.match(regex)) {
			count++;	
		} 
	}
	return count;
}


function fetchAllCapWords(array) {
	var result = [];
	for(var i = 0; i < array.length; i++) {
		var string = array[i].toString();
		var regex = /\b[A-Z]+\b/;
		if(string.match(regex)) {
			result.push(string);
		} 
	}
	return result;
}

// if class 'sold-out' can be iterated -> count++
function fetchNumSoldOut(data) {
	var count = 0;
	data('.sold-out').each(function(i, elem) {
		count++;
	});
	return count;
}

// if class 'limited-number' can be iterated -> count++
function fetchNumLimit(data) {
	var count = 0;
	data('.limited-number').each(function(i, elem) {
		count++
	});
	return count;
}

// sent over chunk of html to make selection efficient and easy 
// (8 left of 10) -> ['8', 'left', 'of', '10'] 
function fetchLimitedData(data, tempJSON) {
	var stuff = cheerio.load(data);
	stuff('.limited-number').each(function(i, elem) {
		var thingy = stuff(this).text().replace(/\(|\)|/g, '').split(' ');
		var left = thingy[0];
		var total = thingy[3];
		var sold = total - left
		tempJSON.sold = sold;
		tempJSON.total = total;
	});
	var deferred = q.defer();
	deferred.resolve(tempJSON);
	return deferred.promise;
}

// makes object global
exports.Pledges = Pledges;
