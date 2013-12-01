// mods and globals
var request = require('request'),
    cheerio = require('cheerio'),
    q = require('q'),
    base_url = 'http://www.kickstarter.com',
    proj_url = base_url+'/projects/597507018/pebble-e-paper-watch-for-iphone-and-android?ref=most-funded',
    General = require('./general/general').General,
    general = new General(),
    Location = require('./location/location').Location,
    location = new Location(),
    Funding = require('./funding/funding').Funding,
    funding = new Funding(),
    Dates = require('./dates/dates').Dates,
    dates = new Dates(),
    Other = require('./other/other').Other,
    other = new Other(),
    Pledges = require('./pledges/pledges').Pledges,
    pledges = new Pledges(),
    Media = require('./media/media').Media,
    media = new Media(),
    Links = require('./links/links').Links,
    links = new Links();

// initiates request 
function fetchProject(url) {
	var deferred = q.defer();
	request.get(url, function(err, req) {
		if(err) {throw err;}
		deferred.resolve(req.body);
	});
	return deferred.promise;
}

// extraction control center
function extractData(data) {

	var projectJSON = {};
	var rawData = cheerio.load(data);

	general.fetchGeneral(rawData, projectJSON);
	location.fetchLocation(rawData, projectJSON);
	funding.fetchFunding(rawData, projectJSON);
	dates.fetchDates(rawData, projectJSON);
	other.fetchOther(rawData, projectJSON);
	var totalBackers = projectJSON['funding']['backers']; // used for pledge % comparison
	pledges.fetchPledges(rawData, projectJSON, totalBackers);
	media.fetchMediaData(rawData, projectJSON);
	links.fetchLinksUsed(rawData, projectJSON);
	
	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;
	
}

function printJSON(data) {
	console.log(data);
}

fetchProject(proj_url).then(extractData).then(printJSON);
