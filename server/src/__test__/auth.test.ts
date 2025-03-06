import axios from "axios";

const api = axios.create({
	baseURL: process.env.API_URL,
});

describe("POST /auth/register", () => {
	it("should register an user", async () => {
		const response = await api.post("/auth/register", {
			login: "gabriel-dpp",
			password: "12345678",
			isAdmin: false,
		});
		expect(response.status).toBe(201);
	});
});
