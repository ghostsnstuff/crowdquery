// locationJSON stores location data in projectJSON
// get raw data and pass it to parseLocation() -> [city, state]
// test if the state var is a US state
// if it is append the appropriate data
// if not its international, append the state as the country
// append locationJSON to projectJSON
// returns promise containing projectJSON
function fetchLocation(data, projectJSON);

// converts string -> array
// e.g. 'san francisco, ca' -> ['san francisco', 'ca']
function parseLocation(data);

// checks if state is a US state
// iterates through an array of states
function fromTheUS(state);