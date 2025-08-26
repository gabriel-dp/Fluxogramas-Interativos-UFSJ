enum LogType {
	DEBUG = "DBG",
	INFO = "INF",
	WARN = "WRN",
	ERROR = "ERR",
	DISABLED = "DISABLED",
}

type Message = string | object;

class Log {
	private logLevel: LogType;

	constructor(logLevel: LogType = LogType.DEBUG) {
		this.logLevel = logLevel;
	}

	shouldLog(type: LogType): boolean {
		const levels = Object.values(LogType);
		return levels.indexOf(type) >= levels.indexOf(this.logLevel);
	}

	formatMessage(type: LogType, message: Message): string {
		const timestamp = new Date().toISOString();
		const text = typeof message == "string" ? message : JSON.stringify(message);
		return `[${timestamp}][${type}] ${text}`;
	}

	log(type: LogType, message: Message): void {
		if (this.shouldLog(type)) {
			const formattedMessage = this.formatMessage(type, message);
			console.log(formattedMessage);
		}
	}

	debug(message: Message) {
		this.log(LogType.DEBUG, message);
	}

	info(message: Message) {
		this.log(LogType.INFO, message);
	}

	warn(message: Message) {
		this.log(LogType.WARN, message);
	}

	error(message: Message) {
		this.log(LogType.ERROR, message);
	}
}

export const log = new Log(process.env.LOG_LEVEL as LogType | undefined);
