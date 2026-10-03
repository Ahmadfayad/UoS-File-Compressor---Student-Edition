'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('./feedback');

async function invoke({ method = 'POST', body = {}, origin = 'https://example.test', host = 'example.test' } = {}) {
	const req = { method, body, headers: { origin, host } };
	const res = {
		statusCode: 200,
		headers: {},
		setHeader(name, value) { this.headers[name] = value; },
		status(code) { this.statusCode = code; return this; },
		json(payload) { this.payload = payload; return this; },
		end() { this.ended = true; return this; },
	};
	await handler(req, res);
	return res;
}

test('rejects methods other than POST', async () => {
	const response = await invoke({ method: 'GET' });
	assert.equal(response.statusCode, 405);
	assert.equal(response.headers.Allow, 'POST');
});

test('rejects cross-origin requests', async () => {
	const response = await invoke({ origin: 'https://attacker.test' });
	assert.equal(response.statusCode, 403);
});

test('rejects out-of-range ratings before database access', async () => {
	const response = await invoke({ body: { rating: 6, mode: 'compress' } });
	assert.equal(response.statusCode, 400);
});

test('silently discards honeypot submissions', async () => {
	const response = await invoke({ body: { website: 'automated', rating: 5, mode: 'compress' } });
	assert.equal(response.statusCode, 204);
	assert.equal(response.ended, true);
});

test('returns a safe setup error when the database is not configured', async () => {
	const previousUrl = process.env.DATABASE_URL;
	delete process.env.DATABASE_URL;
	try {
		const response = await invoke({ body: { rating: 5, mode: 'compress', comment: 'Helpful' } });
		assert.equal(response.statusCode, 503);
		assert.deepEqual(response.payload, { error: 'Feedback storage is not configured.' });
	} finally {
		if (previousUrl !== undefined) process.env.DATABASE_URL = previousUrl;
	}
});
