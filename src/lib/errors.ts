// The refresh token is missing or was rejected. The user must log in again.
export class AuthExpiredError extends Error {
	constructor(message = 'Session expired') {
		super(message);
		this.name = 'AuthExpiredError';
	}
}

// The request never reached the server (offline, DNS failure, timeout).
export class NetworkError extends Error {
	constructor(message = 'Network request failed') {
		super(message);
		this.name = 'NetworkError';
	}
}

// The server answered with a non-2xx status.
export class ApiError extends Error {
	status: number;

	constructor(status: number, message = `HTTP error ${status}`) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}
