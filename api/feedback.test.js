'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('./feedback');
const { sendFeedbackNotification } = handler;
const adminHandler = require('./admin-feedback');
const { getDateBounds, makeCsv } = adminHandler;

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

test('does not send email until all Resend settings are configured', async () => {
	const previous = {
		apiKey: process.env.RESEND_API_KEY,
		recipient: process.env.FEEDBACK_NOTIFICATION_EMAIL,
		sender: process.env.FEEDBACK_FROM_EMAIL,
		fetch: global.fetch,
	};
	delete process.env.RESEND_API_KEY;
	delete process.env.FEEDBACK_NOTIFICATION_EMAIL;
	delete process.env.FEEDBACK_FROM_EMAIL;
	let fetchCalled = false;
	global.fetch = async () => { fetchCalled = true; return { ok: true }; };
	try {
		assert.equal(await sendFeedbackNotification({ rating: 5, comment: '', mode: 'compress' }), false);
		assert.equal(fetchCalled, false);
	} finally {
		global.fetch = previous.fetch;
		if (previous.apiKey !== undefined) process.env.RESEND_API_KEY = previous.apiKey;
		if (previous.recipient !== undefined) process.env.FEEDBACK_NOTIFICATION_EMAIL = previous.recipient;
		if (previous.sender !== undefined) process.env.FEEDBACK_FROM_EMAIL = previous.sender;
	}
});

test('sends a rating notification with escaped comment content', async () => {
	const previous = {
		apiKey: process.env.RESEND_API_KEY,
		recipient: process.env.FEEDBACK_NOTIFICATION_EMAIL,
		sender: process.env.FEEDBACK_FROM_EMAIL,
		fetch: global.fetch,
		consoleError: console.error,
	};
	process.env.RESEND_API_KEY = 'test-key';
	process.env.FEEDBACK_NOTIFICATION_EMAIL = 'owner@example.test';
	process.env.FEEDBACK_FROM_EMAIL = 'Feedback <feedback@example.test>';
	let request;
	global.fetch = async (url, options) => {
		request = { url, options, body: JSON.parse(options.body) };
		return { ok: true };
	};
	try {
		const sent = await sendFeedbackNotification({ rating: 4, comment: '<script>alert(1)</script>', mode: 'convert' });
		assert.equal(sent, true);
		assert.equal(request.url, 'https://api.resend.com/emails');
		assert.deepEqual(request.body.to, ['owner@example.test']);
		assert.match(request.body.html, /&lt;script&gt;/);
		assert.doesNotMatch(request.body.html, /<script>/);
		assert.match(request.body.text, /4\/5/);
		assert.match(request.options.headers.Authorization, /^Bearer test-key$/);
	} finally {
		global.fetch = previous.fetch;
		if (previous.apiKey !== undefined) process.env.RESEND_API_KEY = previous.apiKey; else delete process.env.RESEND_API_KEY;
		if (previous.recipient !== undefined) process.env.FEEDBACK_NOTIFICATION_EMAIL = previous.recipient; else delete process.env.FEEDBACK_NOTIFICATION_EMAIL;
		if (previous.sender !== undefined) process.env.FEEDBACK_FROM_EMAIL = previous.sender; else delete process.env.FEEDBACK_FROM_EMAIL;
	}
});

test('keeps email provider failures non-fatal', async () => {
	const previous = {
		apiKey: process.env.RESEND_API_KEY,
		recipient: process.env.FEEDBACK_NOTIFICATION_EMAIL,
		sender: process.env.FEEDBACK_FROM_EMAIL,
		fetch: global.fetch,
	};
	process.env.RESEND_API_KEY = 'test-key';
	process.env.FEEDBACK_NOTIFICATION_EMAIL = 'owner@example.test';
	process.env.FEEDBACK_FROM_EMAIL = 'Feedback <feedback@example.test>';
	global.fetch = async () => ({ ok: false });
	console.error = () => {};
	try {
		assert.equal(await sendFeedbackNotification({ rating: 1, comment: '', mode: 'split' }), false);
	} finally {
		global.fetch = previous.fetch;
		console.error = previous.consoleError;
		if (previous.apiKey !== undefined) process.env.RESEND_API_KEY = previous.apiKey; else delete process.env.RESEND_API_KEY;
		if (previous.recipient !== undefined) process.env.FEEDBACK_NOTIFICATION_EMAIL = previous.recipient; else delete process.env.FEEDBACK_NOTIFICATION_EMAIL;
		if (previous.sender !== undefined) process.env.FEEDBACK_FROM_EMAIL = previous.sender; else delete process.env.FEEDBACK_FROM_EMAIL;
	}
});

async function invokeAdmin({ method = 'GET', authorization = '', query = {}, origin = 'https://example.test', host = 'example.test' } = {}) {
	const req = { method, query, headers: { authorization, origin, host } };
	const res = {
		statusCode: 200,
		headers: {},
		setHeader(name, value) { this.headers[name] = value; },
		status(code) { this.statusCode = code; return this; },
		json(payload) { this.payload = payload; return this; },
		end() { this.ended = true; return this; },
		send(payload) { this.payload = payload; return this; },
	};
	await adminHandler(req, res);
	return res;
}

test('admin export fails closed when its access key is not configured', async () => {
	const previousKey = process.env.ADMIN_ACCESS_KEY;
	delete process.env.ADMIN_ACCESS_KEY;
	try {
		const response = await invokeAdmin();
		assert.equal(response.statusCode, 503);
		assert.deepEqual(response.payload, { error: 'Admin export is not configured.' });
	} finally {
		if (previousKey !== undefined) process.env.ADMIN_ACCESS_KEY = previousKey;
	}
});

test('admin export rejects invalid keys and cross-origin access', async () => {
	const previousKey = process.env.ADMIN_ACCESS_KEY;
	process.env.ADMIN_ACCESS_KEY = 'a'.repeat(48);
	try {
		const invalidKey = await invokeAdmin({ authorization: `Bearer ${'b'.repeat(48)}` });
		assert.equal(invalidKey.statusCode, 401);
		const crossOrigin = await invokeAdmin({ authorization: `Bearer ${process.env.ADMIN_ACCESS_KEY}`, origin: 'https://attacker.test' });
		assert.equal(crossOrigin.statusCode, 403);
	} finally {
		if (previousKey !== undefined) process.env.ADMIN_ACCESS_KEY = previousKey; else delete process.env.ADMIN_ACCESS_KEY;
	}
});

test('admin export verifies a valid key without reading feedback data', async () => {
	const previousKey = process.env.ADMIN_ACCESS_KEY;
	process.env.ADMIN_ACCESS_KEY = 'c'.repeat(48);
	try {
		const response = await invokeAdmin({ authorization: `Bearer ${process.env.ADMIN_ACCESS_KEY}`, query: { action: 'verify' } });
		assert.equal(response.statusCode, 204);
		assert.equal(response.ended, true);
	} finally {
		if (previousKey !== undefined) process.env.ADMIN_ACCESS_KEY = previousKey; else delete process.env.ADMIN_ACCESS_KEY;
	}
});

test('admin export rejects invalid periods and service filters', async () => {
	const previousKey = process.env.ADMIN_ACCESS_KEY;
	process.env.ADMIN_ACCESS_KEY = 'd'.repeat(48);
	try {
		const authorization = `Bearer ${process.env.ADMIN_ACCESS_KEY}`;
		const invalidPeriod = await invokeAdmin({ authorization, query: { period: 'decade' } });
		assert.equal(invalidPeriod.statusCode, 400);
		assert.deepEqual(invalidPeriod.payload, { error: 'Invalid export period.' });
		const invalidService = await invokeAdmin({ authorization, query: { period: 'all', mode: 'unknown' } });
		assert.equal(invalidService.statusCode, 400);
		assert.deepEqual(invalidService.payload, { error: 'Invalid service filter.' });
	} finally {
		if (previousKey !== undefined) process.env.ADMIN_ACCESS_KEY = previousKey; else delete process.env.ADMIN_ACCESS_KEY;
	}
});

test('admin export reports when Neon storage is not configured', async () => {
	const previous = { key: process.env.ADMIN_ACCESS_KEY, databaseUrl: process.env.DATABASE_URL };
	process.env.ADMIN_ACCESS_KEY = 'e'.repeat(48);
	delete process.env.DATABASE_URL;
	try {
		const response = await invokeAdmin({
			authorization: `Bearer ${process.env.ADMIN_ACCESS_KEY}`,
			query: { period: 'all', mode: 'all' },
		});
		assert.equal(response.statusCode, 503);
		assert.deepEqual(response.payload, { error: 'Feedback storage is not configured.' });
	} finally {
		if (previous.key !== undefined) process.env.ADMIN_ACCESS_KEY = previous.key; else delete process.env.ADMIN_ACCESS_KEY;
		if (previous.databaseUrl !== undefined) process.env.DATABASE_URL = previous.databaseUrl; else delete process.env.DATABASE_URL;
	}
});

test('admin date bounds cover UTC week, month, year, and inclusive custom days', () => {
	const now = new Date('2026-10-04T15:00:00.000Z');
	assert.deepEqual(getDateBounds('week', undefined, undefined, now), {
		start: '2026-09-28T00:00:00.000Z',
		end: '2026-10-05T00:00:00.000Z',
	});
	assert.deepEqual(getDateBounds('month', undefined, undefined, now), {
		start: '2026-10-01T00:00:00.000Z',
		end: '2026-11-01T00:00:00.000Z',
	});
	assert.deepEqual(getDateBounds('year', undefined, undefined, now), {
		start: '2026-01-01T00:00:00.000Z',
		end: '2027-01-01T00:00:00.000Z',
	});
	assert.deepEqual(getDateBounds('custom', '2026-10-02', '2026-10-04'), {
		start: '2026-10-02T00:00:00.000Z',
		end: '2026-10-05T00:00:00.000Z',
	});
	assert.ok(getDateBounds('custom', '2026-10-05', '2026-10-04').error);
});

test('CSV export quotes fields and neutralizes spreadsheet formulas', () => {
	const csv = makeCsv([{ id: 1, created_at: '2026-10-04T00:00:00Z', rating: 2, tool_mode: 'compress', comment: '=HYPERLINK("https://example.test")' }]);
	assert.equal(csv.split('\r\n')[1], "\"1\",\"2026-10-04T00:00:00Z\",\"2\",\"compress\",\"'=HYPERLINK(\"\"https://example.test\"\")\"");
});
