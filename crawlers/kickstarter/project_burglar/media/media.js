var cheerio = require('cheerio'),
    q = require('q');

// global obj
var Media = function() {};

// fetches array of media from description section of profile page
// append the files and # of items used to projectJSON
Media.prototype.fetchMediaData = function(data, projectJSON) {
	
	var array = [];
	var mediaJSON = {};
	var descriptionHTML = data('#main #about .full-description').html();
	descriptionHTML = cheerio.load(descriptionHTML);
	descriptionHTML('img').each(function(i, elem) {
		var img = descriptionHTML(this).attr('src');
		array.push(img);
	});
	var numMedia = array.length;
	mediaJSON.num_media = numMedia;
	mediaJSON.media_files = array;

	projectJSON.media = mediaJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;
	
}

exports.Media = Media;
