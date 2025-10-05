export class RequestException extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RequestException";
	}
}

export class NotFoundException extends RequestException {
	constructor(entity: string) {
		super(`Não há registro de ${entity} correspondente`);
	}
}

export class ConflictException extends RequestException {
	public attribute: string | undefined;

	constructor(entity: string, attribute?: string) {
		if (!attribute) super(`Há dados conflitantes com ${entity}`);
		else super(`Já existe ${entity} com o atributo ${attribute}`);
	}
}

export class AuthException extends RequestException {
	constructor() {
		super("Permissão negada");
	}
}
