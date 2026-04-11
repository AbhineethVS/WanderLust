const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	image: {
		type: {
			filename: String,
			url: String,
		},
		default:
			"https://unsplash.com/photos/a-sunset-over-a-body-of-water-with-houses-in-the-background-jVrZgVhqsqs",
		set: (v) =>
			v === ""
				? "https://unsplash.com/photos/a-sunset-over-a-body-of-water-with-houses-in-the-background-jVrZgVhqsqs"
				: v,
	},
	price: Number,
	location: String,
	country: String,
});

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;
