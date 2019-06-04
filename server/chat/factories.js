const uuid = require('uuid/v4')

// TODO: typescript-ify this whole file (it would really help with the goofy function args)

// Creates a user.
function createUser({name = "", socketId = null} = {}) {
	let user = {
		id: uuid(),
		name,
		socketId,
	};
	
	return user;
}

// Creates a messages object.
function createMessage({message = "", sender = ""} = {}) {
	let message = {
		id: uuid(),
		time: new Date(Date.now()),
		message,
		sender,
	};

	return message;
}

// Creates a room object
function createRoom({messages = [], name = "Community", users = []} = {}) {
	let room = {
		id: uuid(),
		name,
		messages,
		users,
		typingUsers: [],
	};

	return room;
}

module.exports = {
	createMessage,
	createRoom,
	createUser
}