import { Request, Response } from "express";

function helloWorld(_: Request, res: Response) {
	return res.status(200).send("Hello World!");
}

export default { helloWorld };
