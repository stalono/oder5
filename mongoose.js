const { userSchema } = require('./schemas/user-schema.js');
const { dblink } = require('./json/config.json');
const mongoose = require('mongoose');

mongoose.connect(dblink);

function toModel(name, schema) {
	return mongoose.model(name, schema);
}

async function insertNew(model, data, collection) {
	const newModel = new model(data, collection);
	return await newModel.save();
}

async function createUser(id) {
	const userModel = toModel('user', userSchema);
	const userData = await userModel.findOne({ id: id });
	if (!userData) {
		const user = await insertNew(userModel, { id: new mongoose.Types.Decimal128(id) }, 'users');
		return user;
	} else {
		return userData;
	}
}

async function addEmeralds(id, amount) {
	const user = await createUser(id);
	user.emeralds += amount;
	await user.save();
	return user;
}

async function removeEmeralds(id, amount) {
	const user = await createUser(id);
	user.emeralds -= amount;
	await user.save();
	return user;
}

async function getUser(id) {
	const user = await createUser(id);
	return user;
}

async function addOre(name, id) {
	const user = await createUser(id);
	switch(name) {
		case 'amethyst':
			user.amethyst += 1;
			break;
		case 'diamonds':
			user.diamonds += 1;
			break;
		case 'gold':
			user.gold += 1;
			break;
		case 'iron':
			user.iron += 1;
			break;
		case 'stone':
			user.stone += 1;
			break;
	}
	await user.save();
	return name;
}

module.exports = { createUser, addEmeralds, removeEmeralds, getUser, addOre };