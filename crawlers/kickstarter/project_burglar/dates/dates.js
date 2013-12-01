var q = require('q');

// global obj
var Dates = function() {};

// fetches # days, start date, and end date
Dates.prototype.fetchDates = function(data, projectJSON) {
	
	var dateJSON = {};
	var projectDates = data('#meta .tiny_type').text().toLowerCase().trim();
	projectDates = parseDates(projectDates);
	var duration = parseDuration(projectDates[2]);
	dateJSON.duration = duration;

	// start date info
	var rawStartDate = createDate(projectDates[0]);
	var startDayNum = rawStartDate.getDay();
	var startDayText = convertDay(startDayNum);	
	var startDay = [];
	startDay.push(startDayText, startDayNum);
	dateJSON.start_day = startDay;	
	var startDateArray = splitDate(projectDates[0]);
	dateJSON.start_date = startDateArray[1]; 
	var month = fetchMonth(projectDates[0]);
	dateJSON.start_month = month; 
	dateJSON.start_year = startDateArray[2];
	
	// end date info
	var rawEndDate = createDate(projectDates[1]);
	var endDayNum = rawEndDate.getDay();
	var endDayText = convertDay(endDayNum);
	var endDay = [];
	endDay.push(endDayText, endDayNum);
	dateJSON.end_day = endDay;
	var endDateArray = splitDate(projectDates[1]);
	dateJSON.end_date = endDateArray[1];
	var month = fetchMonth(projectDates[1]);
	dateJSON.end_month = month;
	dateJSON.end_year = endDateArray[2];

	// add nested json
	projectJSON.dates = dateJSON;

	var deferred = q.defer();
	deferred.resolve(projectJSON);
	return deferred.promise; 
		

}

// regexp for raw string date
function parseDates(data) {
	var result = [];
	data = data.split('\n');
	for(var i in data) {
		data[i] = data[i].replace(/\n|\,|\(|\)|\-/g, '');	
		result.push(data[i]);
	}
	return result;
}

// returns # days
function parseDuration(data) {
	data = data.split(' ');
	return data[0];
}

// creates date object
function createDate(data) {	
	data = data.trim();
	data = data.split(' ');
	var month = convertMonth(data[0]);
	var date = data[1];
	var year = data[2];
	var date = new Date(year, month, date);
	return date;
}

// returns numerical month
function convertMonth(data) {
	var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	for(var i in months) {
		if(months[i] === data) {
			return i;
		}
	}
}

// if 0 -> returns sun
function convertDay(data) {
	var days = ['sun','mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
	for(var i = 0; i < days.length; i++) {
		if(i === data) {
			return days[i];
		}
	}
}

// returns ['jan', 0]
function fetchMonth(data) {
	var result = [];
	data = data.trim();
	data = data.split(' ');
	var month = data[0];
	var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	for(var i in months) {
		if(months[i] === month) {
			result.push(months[i], i);
			return result;
		}
	}
}

// returns date arrray -> ['apr', '11', '2012']
function splitDate(data) {
	var result = [];
	data = data.trim();
	data = data.split(' ');
	var month = data[0];
	var date = data[1];
	var year = data[2];
	result.push(month, date, year);
	return result;
}

exports.Dates = Dates;
