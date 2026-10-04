'use strict';

const auth = require('../lib/admin-auth');
const ExcelJS = require('exceljs');
const { neon } = require('@neondatabase/serverless');

const ALLOWED_MODES = new Set(['compress', 'convert', 'merge', 'split']);
const ALLOWED_PERIODS = new Set(['all', 'week', 'month', 'year', 'custom']);

function getUtcDate(value) {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const date = new Date(`${value}T00:00:00.000Z`);
	return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function getDateBounds(period, from, to, now = new Date(), timezone = 'UTC', anchor) {
	if (!['UTC','Asia/Dubai'].includes(timezone)) return { error: 'Invalid timezone.' };
	const offset = timezone === 'Asia/Dubai' ? 4 * 60 * 60 * 1000 : 0;
	const shift = (date) => new Date(date.getTime() - offset).toISOString();
	if (anchor) { const selected = getUtcDate(anchor); if (!selected) return { error: 'Choose a valid timeline date.' }; now = selected; }
	else now = new Date(now.getTime() + offset);
	if (!ALLOWED_PERIODS.has(period)) return { error: 'Invalid export period.' };
	if (period === 'all') return { start: null, end: null };

	if (period === 'custom') {
		const fromDate = getUtcDate(from);
		const toDate = getUtcDate(to);
		if (!fromDate || !toDate || fromDate > toDate) {
			return { error: 'Choose a valid start and end date, with the start date no later than the end date.' };
		}
		return {
			start: shift(fromDate),
			end: shift(new Date(toDate.getTime() + 24 * 60 * 60 * 1000)),
		};
	}

	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	if (period === 'week') {
		const daysSinceMonday = (today.getUTCDay() + 6) % 7;
		const start = new Date(today.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
		return { start: shift(start), end: shift(new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)) };
	}
	if (period === 'month') {
		const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
		return { start: shift(start), end: shift(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1))) };
	}
	const start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
	return { start: shift(start), end: shift(new Date(Date.UTC(today.getUTCFullYear() + 1, 0, 1))) };
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
	res.setHeader('Vary', 'Cookie');

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

	if (!auth.config()) return res.status(503).json({ error: 'Admin sign-in is not configured.' });
	try { if (!await auth.authorized(req)) return res.status(401).json({ error: 'Please sign in.' }); }
	catch { return res.status(503).json({ error: 'Admin sign-in is temporarily unavailable.' }); }

	const query = req.query || {};
	const action = typeof query.action === 'string' ? query.action : '';
	if (action === 'verify') return res.status(204).end();

	const period = typeof query.period === 'string' ? query.period : 'all';
	const mode = typeof query.mode === 'string' ? query.mode : 'all';
	if (mode !== 'all' && !ALLOWED_MODES.has(mode)) return res.status(400).json({ error: 'Invalid service filter.' });

	const format = query.format || 'csv';
	if (!['csv','xlsx','json'].includes(format)) return res.status(400).json({error:'Invalid export format.'});
	const bounds = getDateBounds(period, query.from, query.to, new Date(), query.timezone || 'Asia/Dubai', query.anchor);
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
		if (format === 'json') return res.status(200).json({ rows, timezone: query.timezone || 'Asia/Dubai', bounds });
		if (format === 'xlsx') {
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('Customer feedback');
			sheet.columns = [{header:'ID',key:'id',width:12},{header:'Submitted (UTC)',key:'created_at',width:28},{header:'Rating',key:'rating',width:10},{header:'Service',key:'tool_mode',width:16},{header:'Comment',key:'comment',width:70}];
			for (const row of rows) sheet.addRow({...row, created_at: new Date(row.created_at).toISOString()});
			sheet.getRow(1).font = {bold:true}; sheet.views = [{state:'frozen',ySplit:1}];
			sheet.autoFilter = {from:'A1',to:'E1'}; sheet.getColumn('comment').alignment = {wrapText:true,vertical:'top'};
			res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition',`attachment; filename="customer-feedback-${period}-${mode}.xlsx"`);
			return res.status(200).send(Buffer.from(await workbook.xlsx.writeBuffer()));
		}
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
