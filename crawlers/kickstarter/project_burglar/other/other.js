var q = require('q');

// global obj
var Other = function() {};

// fetches # updates and comments, website data, checks facebook-connected, checks first-time creator
Other.prototype.fetchOther = function(data, projectJSON) {

	var otherJSON = {};
	
	var updates = data('#updates_count').attr('data-updates-count');
	otherJSON.updates = updates;
	var comments = data('#comments_count').attr('data-comments-count');
	otherJSON.comments = comments;
	var involvementData = data('#creator-details .text').eq(0).text().trim().toLowerCase().split('\n'); 
	var firstCreated = involvementData[0]; 
	if(firstCreated === 'first created') {
		fetchFirstTimeData(data, involvementData, otherJSON);
	} else {
		fetchMultipleTimesData(data, involvementData, otherJSON) 
	}
	var facebookAttribute = data('#creator-details ul li').eq(1).attr('class');
	if(facebookAttribute === 'facebook-connected') {
		fbConnectTrue(data, otherJSON);
	} else {
		otherJSON.fb_connected = false;
	}

	var websiteLink = data('#creator-details .links a').attr('href');
	var websiteName = data('#creator-details .links a').text().split('.');
	websiteName = websiteName[0];
	otherJSON.website_link = websiteLink;
	otherJSON.website_name = websiteName;

	// append nested json
	projectJSON.other = otherJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;
}

// first-time creator, append project and backing data
function fetchFirstTimeData(data, array, otherJSON) {
	 
	var rawData = array[2].split(' ');
	var projectsBacked = rawData[0];
	//var pbLink = base_url + data('#creator-details .divider').eq(0).next().attr('href');
	otherJSON.projects_created = 1;
	otherJSON.projects_backed = projectsBacked;
	//otherJSON.proj_back_link = pbLink;

	var deferred = q.defer();
	deferred.resolve(otherJSON);
	return deferred.promise;

}

// if repeat creator, append creator's projects and backing data
function fetchMultipleTimesData(data, array, otherJSON) {
	
	var rawData = array[0].split(' ');
	var projectsCreated = rawData[0];
	var rawData = array[2].split(' ');
	var projectsBacked = rawData[0];
	var projectsCreatedLink = base_url + data('#creator-details .divider').eq(0).prev().attr('href');
	//var projectsBackedLink = base_url + data('#creator-details .divider').eq(0).next().attr('href');
	otherJSON.projects_created = projectsCreated;
	otherJSON.projects_backed = projectsBacked;
	otherJSON.proj_created_link = projectsCreatedLink;
	//otherJSON.proj_backed_link = projectsBackedLink;

	var deferred = q.defer();
	deferred.resolve(otherJSON);
	return deferred.promise;

}

// appends username, profile link, and # friends
function fbConnectTrue(data, otherJSON) {
	
	var rawData = data('#creator-details .facebook-connected a');
	var name = rawData.text();
	var href = rawData.attr('href');
	var numFriends = rawData.next().text().trim().split('\n');
	numFriends = numFriends[0];
	otherJSON.fb_connected = true;
	otherJSON.fb_name = name;
	otherJSON.fb_profile = href;
	otherJSON.fb_friends = numFriends;

	var deferred = q.defer();
	deferred.resolve(otherJSON);
	return deferred.promise;

}

exports.Other = Other;
