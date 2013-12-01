var q = require('q');

// global obj
var Location = function() {};

// fetches city, state, country
Location.prototype.fetchLocation = function(data, projectJSON) {

	var locationJSON = {};

	var location = data('.small_type .location a').text().toLowerCase();
	location = parseLocation(location);
	var city = location[0];
	locationJSON.city = city;
	var state = location[1];
	if(fromTheUS(state)) {
		locationJSON.state = state;
		locationJSON.country = "usa";	
	} else {
		locationJSON.country = state; 
	}

	projectJSON.location = locationJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise;

}

// return array [city, state] 
function parseLocation(data) {
	data = data.split(',');
	for(var i in data) {
		data[i] = (data[i]).toString().trim();
	}
	return data;
}

// tests if second location element is in the US
function fromTheUS(state) {
	var isFromTheUS = false;
	var states = ["AL","AK","AZ","AR","CA",
  		      "CO","CT","DE","FL","GA",
  		      "HI","ID","IL","IN","IA",
  		      "KS","KY","LA","ME","MD",
  		      "MA","MI","MN","MS","MO",
  		      "MT","NE","NV","NH","NJ",
  		      "NM","NY","NC","ND","OH",
  		      "OK","OR","PA","RI","SC",
  		      "SD","TN","TX","UT","VT",
  		      "VA","WA","WV","WI","WY"];
	for(var i in states) {
		if(states[i] === state.toUpperCase()) {
			isFromTheUS = true;
			break;
		}
	}
	return isFromTheUS;
}

// makes object global
exports.Location = Location;
