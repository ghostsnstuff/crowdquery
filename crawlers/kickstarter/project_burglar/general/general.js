var	q = require('q');

var base_url = 'http://www.kickstarter.com';

var General = function() {};

General.prototype.fetchGeneral = function(data, projectJSON) {
	
	var generalJSON = {};

	var title = data('#project-header #title a').text();
	generalJSON.title = title;

	var creator = data('#project-header #name').text();
	generalJSON.creator = creator;

	var parentCategory = data('.category').attr('data-project-parent-category');
	generalJSON.parent_category = parentCategory;

	var subCategory = data('.category').text().trim();
	generalJSON.sub_category = subCategory;

	var avatar = data('.avatar-medium').attr('src');
	generalJSON.avatar = avatar;

	var projectPage = data('#title a').attr('href');
	projectPage = base_url+projectPage;
	generalJSON.project_page = projectPage;

	var creatorProfilePage = data('#name').attr('href');
	creatorProfilePage = base_url + creatorProfilePage;
	generalJSON.creator_profile_page = creatorProfilePage;

	var projectVideo = data('#video-section div').attr('data-video');
	generalJSON.video = projectVideo;

	// append nested json  
	projectJSON.general = generalJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;

}

exports.General = General;