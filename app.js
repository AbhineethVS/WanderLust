const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing");
const path = require("path");
const req = require("express/lib/request");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
	res.send("root is working!");
});

// INDEX route
app.get("/listings", async (req, res) => {
	const allListings = await Listing.find({});
	res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
	res.render("listings/new.ejs");
});
app.post("/listings", async (req, res) => {
	let { listing } = req.body;

	// Convert the image string from the form into the required object format
	listing.image = {
		filename: "listingimage", // Default filename
		url: listing.image, // The URL string from your form input
	};

	const newListing = new Listing(listing);
	await newListing.save();

	res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	res.render("listings/edit.ejs", { listing });
});
app.put("/listings/:id", async (req, res) => {
	let { id } = req.params;
	let { listing } = req.body;
	listing.image = {
		filename: "listingImage",
		url: listing.image,
	};
	await Listing.findByIdAndUpdate(id, listing);
	res.redirect(`/listings/${id}`);
});

// DELETE route
app.delete("/listings/:id", async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndDelete(id);
	res.redirect("/listings");
});

//SHOW Route
app.get("/listings/:id", async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	res.render("listings/show.ejs", { listing });
});

// app.use((err, req, res, next) => {
// 	res.send("Something went wrong!");
// });

app.listen(port, () => {
	console.log(`listening through port ${port}`);
});
