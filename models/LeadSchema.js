const mongoose = require("mongoose");

let leadSchema = new mongoose.Schema({

	phoneNumber: String,
	firstName: String,
	lastName: String,
	email: String,
	smsCount: String,
	newContact: Boolean,

  	citizenship: Boolean,
  	voterregistration: Boolean,
  	jobs: Boolean

});

module.exports = mongoose.model("Lead", leadSchema);