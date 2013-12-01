// dateJSON stores location data in projectJSON
// initial projectDates is raw string data
// pass projectDates to parseDates() to remove unwanted chars
// use the raw string data to create dates
// associated w/ project start and end dates
// append dateJSON to projectJSON
// returns promise containing projectJSON
function fetchDates(data, projectJSON);

// remove unwanted chars from initial data src
// split \n first -> keeps data oriented in a workable manner
// then remove chars for each array elements
function parseDates(data)

// removes 'days'
// keeps # days only
function parseDuration(data)

// creates date obj using parsed data 
// yr month day 
// month: 0 - 11
function createDate(data)

// text -> num  
// e.g. apr -> 3
// 0 - 11 === jan - dec
function convertMonth(data);

// num -> text
// e.g. 3 -> wed
// 0 - 6 === sun - sat
function convertDay(data);

// takes initial raw data
// converts -> array
// e.g. 'apr 11 2012' -> ['apr', '11', '2012']
// month = data[0]
// if(month in months)
// returns month string, and month # 
function fetchMonth(data);


// converts initial raw data -> array
// e.g. 'apr 11 2012' -> ['apr', '11', '2012']
function splitDate(data);