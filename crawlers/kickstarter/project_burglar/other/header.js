// fetches # updates and comments, start and end dates data,
// and website name and link
// involvementData = array -> ['# created', '.', '# backed'] 
// check first position to handle variation of html structures
// first position will either be 'first created' or '3 created'
// html is different depending on the above statement
// the first case isn't in an <a> 
// it doesn't have a href to all of the projects they have created
// appends otherJSON to projectJSON
// returns promise containing projectJSON
function fetchOther(data, projectJSON);

// fxn called when it's creator's first project
// ['first created', '.', '15 backed']
// appends proj_created, proj_backed, and proj_back_link to otherJSON
// returns promise containing projectJSON
function fetchFirstTimeData(data, array, otherJSON);

// repeat creator fxn 
// raw data ['3 created', '.', '15 backed']
// manipulates raw data accordingly
// appends proj_created, proj_backed, and their profile page links
// returns promise containing projectJSON
function fetchMultipleTimesData(data, array, otherJSON);

// rawData is the desired html element 
// name is the fb username
// href is a link to their fb page
// numFriends data is located 1 element after rawData 
// numFriends returns array -> ['780', 'friends']
// numFriends = ['780']
// append otherJSON values
// create & return promise
function fbConnectTrue(data, otherJSON);