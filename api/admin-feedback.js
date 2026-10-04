'use strict';

const { timingSafeEqual } = require('node:crypto');
const { neon } = require('@neondatabase/serverless');

const ALLOWED_MODES = new Set(['compress', 'convert', 'merge', 'split']);
const ALLOWED_PERIODS = new Set(['all', 'week', 'month', 'year', 'custom']);

function isAuthorized(req) {
	const expected = process.env.ADMIN_ACCESS_KEY;
	const authorization = req.headers.authorization || '';
	const provided = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
	if (!expected || expected.length < 32) return false;
	const providedBytes = Buffer.from(provided);
	const expectedBytes = Buffer.from(expected);
	if (providedBytes.length !== expectedBytes.length) return false;
	return timingSafeEqual(providedBytes, expectedBytes);
}

function getUtcDate(value) {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const date = new Date(`${value}T00:00:00.000Z`);
	return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function getDateBounds(period, from, to, now = new Date()) {
	if (!ALLOWED_PERIODS.has(period)) return { error: 'Invalid export period.' };
	if (period === 'all') return { start: null, end: null };

	if (period === 'custom') {
		const fromDate = getUtcDate(from);
		const toDate = getUtcDate(to);
		if (!fromDate || !toDate || fromDate > toDate) {
			return { error: 'Choose a valid start and end date, with the start date no later than the end date.' };
		}
		return {
			start: fromDate.toISOString(),
			end: new Date(toDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
		};
	}

	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	if (period === 'week') {
		const daysSinceMonday = (today.getUTCDay() + 6) % 7;
		const start = new Date(today.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
		return { start: start.toISOString(), end: new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() };
	}
	if (period === 'month') {
		const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
		return { start: start.toISOString(), end: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1)).toISOString() };
	}
	const start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
	return { start: start.toISOString(), end: new Date(Date.UTC(today.getUTCFullYear() + 1, 0, 1)).toISOString() };
}

function csvCell(value) {
	let text = value == null ? '' : String(value);
	if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
	return `"${text.replace(/"/g, '""')}"`;
}

function makeCsv(rows) {
	const columns = ['id', 'created_at', 'rating', 'tool_mode', 'comment'];
	return [
		columns.map(csvCell).join(','),
		...rows.map((row) => columns.map((column) => csvCell(row[column])).join(',')),
	].join('\r\n');
}

module.exports = async function handler(req, res) {
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('Vary', 'Authorization');

	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).json({ error: 'Method not allowed.' });
	}

	const origin = req.headers.origin;
	const host = req.headers.host;
	if (origin && host) {
		try {
			if (new URL(origin).host !== host) return res.status(403).json({ error: 'Cross-origin requests are not accepted.' });
		} catch (error) {
			return res.status(403).json({ error: 'Invalid request origin.' });
		}
	}

	if (!process.env.ADMIN_ACCESS_KEY || process.env.ADMIN_ACCESS_KEY.length < 32) {
		return res.status(503).json({ error: 'Admin export is not configured.' });
	}
	if (!isAuthorized(req)) return res.status(401).json({ error: 'Admin access key is invalid.' });

	const query = req.query || {};
	const action = typeof query.action === 'string' ? query.action : '';
	if (action === 'verify') return res.status(204).end();

	const period = typeof query.period === 'string' ? query.period : 'all';
	const mode = typeof query.mode === 'string' ? query.mode : 'all';
	if (mode !== 'all' && !ALLOWED_MODES.has(mode)) return res.status(400).json({ error: 'Invalid service filter.' });

	const bounds = getDateBounds(period, query.from, query.to);
	if (bounds.error) return res.status(400).json({ error: bounds.error });
	if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'Feedback storage is not configured.' });

	try {
		const sql = neon(process.env.DATABASE_URL);
		const rows = await sql`
			SELECT id, created_at, rating, tool_mode, comment
			FROM public.customer_feedback
			WHERE (${bounds.start === null} = TRUE OR created_at >= ${bounds.start}::timestamptz)
				AND (${bounds.end === null} = TRUE OR created_at < ${bounds.end}::timestamptz)
				AND (${mode} = 'all' OR tool_mode = ${mode})
			ORDER BY created_at DESC, id DESC
		`;
		const csv = `\uFEFF${makeCsv(rows)}`;
		const modeSuffix = mode === 'all' ? 'all-services' : mode;
		const filename = `customer-feedback-${period}-${modeSuffix}.csv`;
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		return res.status(200).send(csv);
	} catch (error) {
		console.error('Feedback export could not be generated.');
		return res.status(500).json({ error: 'Feedback export could not be generated.' });
	}
};

module.exports.getDateBounds = getDateBounds;
module.exports.csvCell = csvCell;
module.exports.makeCsv = makeCsv;
