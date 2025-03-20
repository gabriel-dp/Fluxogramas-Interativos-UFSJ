import { Response } from "express";

import { AuthRequest, isAdministrator, isAuthenticated } from "./auth.utils";

export class RequestException extends Error {
	public code: number;

	constructor(code: number, message: string) {
		super(message);
		this.code = code;
		this.name = "RequestException";
	}
}

export function handleError(res: Response, error: unknown) {
	if (error instanceof RequestException) {
		return res.status(error.code).json(error.message);
	}
	return res.status(500).json(error);
}

export class BadRequestException extends RequestException {
	constructor(message: string) {
		super(400, message);
	}
}

export class AuthException extends RequestException {
	constructor(req: AuthRequest, message: string) {
		const code = !isAuthenticated(req) ? 401 : !isAdministrator(req) ? 403 : 500;
		super(code, message);
	}
}

export class NotFoundException extends RequestException {
	constructor(message: string) {
		super(404, message);
	}
}

export class ConflictException extends RequestException {
	constructor(message: string) {
		super(409, message);
	}
}

export class ServerException extends RequestException {
	constructor(message: string) {
		super(500, message);
	}
}
