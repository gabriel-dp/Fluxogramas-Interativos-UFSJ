import mongoose from "mongoose";

// Mongoose will return an error if a query does not match the schema
mongoose.set("strictQuery", true);

export default async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "");
		console.log("MongoDB connected!");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
}
