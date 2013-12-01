var q = require('q');

// global obj
var Funding = function() {};

// fetches backers, goal, $ raised, % raised, currency
Funding.prototype.fetchFunding = function(data, projectJSON) {

	var fundingJSON = {};

	var backers = data('#backers_count').attr('data-backers-count');
	fundingJSON.backers = backers;
	var goal = data('#pledged').attr('data-goal');
	fundingJSON.goal = goal;
	var raised = data('#pledged').attr('data-pledged');
	fundingJSON.raised = raised;
	var percentRaised = data('#pledged').attr('data-percent-raised')*100;
	percentRaised = parseFloat(percentRaised).toFixed(2);
	var successful = percentRaised >= 100;
	fundingJSON.successful = successful;
	fundingJSON.percent_raised = percentRaised;
	var currency = data('#pledged data').attr('data-currency');
	fundingJSON.currency = currency;
	
	// append nested json
	projectJSON.funding = fundingJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;
}

exports.Funding = Funding;
