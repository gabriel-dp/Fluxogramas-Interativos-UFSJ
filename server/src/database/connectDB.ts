import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export default function connectDB() {
	mongoose
		.connect(process.env.MONGODB_URI || "")
		.then(() => console.warn("MongoDB Connected!"))
		.catch((error) => console.error(error));
}
