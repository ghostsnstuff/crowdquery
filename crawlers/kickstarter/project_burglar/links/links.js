var cheerio = require('cheerio'),
    q = require('q');

var Links = function() {};

Links.prototype.fetchLinksUsed = function(data, projectJSON) {

	var array = [];
	var linksJSON = {};
	var descriptionHTML = data('#main #about').html();
	descriptionHTML = cheerio.load(descriptionHTML);
	descriptionHTML('a').each(function(i, elem) {
		var img = descriptionHTML(this).attr('href');
		array.push(img);
	});
	linksJSON.num_links = array.length;
	linksJSON.all_links = array;
	projectJSON.links = linksJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;

}

exports.Links = Links;
