// locationJSON stores location data in projectJSON
// gets raw data and passes it to parseLocation() -> [city, state]
// tests if the state var is a US state
// if it is -> appends the appropriate data
// if not -> its international, appends the state as the country
// appends locationJSON to projectJSON
// returns promise containing projectJSON
function fetchLocation(data, projectJSON);

// converts string -> array
// e.g. 'san francisco, ca' -> ['san francisco', 'ca']
function parseLocation(data);

// checks if state is a US state
// iterates through an array of states
function fromTheUS(state);
