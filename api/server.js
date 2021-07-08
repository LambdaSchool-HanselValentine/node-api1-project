// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");

// Instance of Express App
const app = express();

//Global Middleware
app.use(express.json());

// ENDPOINTS: ===============

//  [GET] Hello World
app.get("/", (req, res) => {
	res.send("Hello World from Express app!");
});

// [POST] /api/users
// Creates a user using the information sent inside the {request body}.
app.post("/api/users", async (req, res) => {
	// the body which are {name: "", bio: ""}
	const userData = req.body;
	const newUser = await User.insert(userData);

	// if data is valid:
	if (userData.name && userData.bio) {
		res.status(201).json(newUser); // status code 201 = Created
	}
	// if not valid, respond with error code
	else if (!userData.name || !userData.bio) {
		res
			.status(400) //error code 400 = Bad request
			.json({ message: "Please provide name and bio for the user" });
	}
	// catch
	else {
		res.status(500).json({
			message: "There was an error while saving the user to the database",
			//error code 500: unexpected error occurred. no other error code is suitable
		});
	}

	// ==== code below also works, idk which one is better ======

	// try {
	// 	// if data is valid:
	// 	if (userData.name && userData.bio) {
	// 		res.status(201).json(newUser); // status code 201 = Created
	// 	}
	// 	// if not valid, respond with error code
	// 	else {
	// 		res
	// 			.status(400) //error code 400 = Bad request
	// 			.json({ message: "Please provide name and bio for the user" });
	// 	}
	// } catch {
	// 	res.status(500).json({
	// 		message: "There was an error while saving the user to the database",
	// 		//error code 500: unexpected error occurred. no other error code is suitable
	// 	});
	// }
});

// [GET] /api/users
// Returns an array users.
app.get("/api/users", async (req, res) => {
	const users = await User.find();

	// if (users) {
	// 	res.status(200).json(users); //status code 200 = success
	// } else {
	// 	res
	// 		.status(500)
	// 		.json({ message: "he users information could not be retrieved" });
	// }

	// Hmmm, I guess you can also write it this way?
	users
		? res.status(200).json(users)
		: res
				.status(500)
				.json({ message: "The users information could not be retrieved" });
});

// [GET] /api/users/:id
// Returns the user object with the specified {id}.
app.get("/api/users/:id", async (req, res) => {
	const { id } = req.params;

	const user = await User.findById(id);
	if (user) {
		// user found success:
		res.status(200).json(user);
	} else if (!user) {
		// user not found. error 404 = Not Found
		res
			.status(404)
			.json({ message: "The user with the specified ID does not exist" });
	} else {
		//generic error response 500:
		res
			.status(500)
			.send({ message: "The user information could not be retrieved" });
	}
});

// [DELETE] /api/users/:id
// Removes the user with the specified {id} and returns the deleted user.
app.delete("/api/users/:id", async (req, res) => {
	const { id } = req.params;
	const user = await User.remove(id);

	// ternary operator if-else with try-catch.
	// idk what the diff is with using if, else if, and else:

	// try {
	// 	user
	// 		? res.status(200).json(user)
	// 		: res
	// 				.status(404)
	// 				.json({ message: "The user with the specified ID does not exist" });
	// } catch (error) {
	// 	res.status(500).json({ message: "The user could not be removed" });
	// }

	if (user) {
		res.status(200).json(user);
	} else if (!user) {
		res
			.status(404)
			.json({ message: "The user with the specified ID does not exist" });
	} else {
		res.status(500).json({ message: "The user could not be removed" });
	}
});

// [PUT] /api/users/:id
// Updates the user with the specified {id} using data from the {request body}. Returns the modified user
app.put("/api/users/:id", async (req, res) => {
	const { id } = req.params;
	const newData = req.body;

	try {
		const updatedUser = await User.update(id, newData);

		if (updatedUser) {
			res.status(201).json(updatedUser);
		} else if (!newData.name || !newData.bio) {
			res
				.status(400) //400 = bad request
				.json({ message: "Please provide name and bio for the user" });
		} else {
			res
				.status(404) //404 = not found
				.json({
					message: "The user with the specified ID does not exist",
				});
		}
	} catch {
		res.status(500).json({
			message: "The user information could not be modified",
		});
	}
});

module.exports = app; // EXPORT YOUR SERVER instead of {}
