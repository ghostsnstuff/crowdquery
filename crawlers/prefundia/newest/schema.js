var mongoose = require('mongoose');

var PrefundiaSchema = mongoose.Schema({
	project_title: String,
	project_href: String
});

var PrefundiaProject = mongoose.model('Prefundia', PrefundiaSchema);

exports.PrefundiaProject; 