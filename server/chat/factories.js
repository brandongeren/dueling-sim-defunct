const uuid = require('uuid/v4')

// TODO: typescript-ify this whole file (it would really help with the goofy function args)

// Creates a room object
// pm argument is true if the room is a direct message
function createRoom({messages = [], name, users = [], pm = false} = {}) {
	let id = '';
	// if the message is a pm, then the id is the 
	if (pm) {
		for (user of users) {
			id = id.concat([user.id, "-"]);
		}
	} else {
		id = uuid();
	}

	let room = {
		id,
		name,
		messages,
		users,
		typingUsers: [],
	};	

	return room;
}

module.exports = {
	createRoom,
}