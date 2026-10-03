'use strict';

const { neon } = require('@neondatabase/serverless');

const ALLOWED_MODES = new Set(['compress', 'convert', 'merge', 'split']);
const MAX_BODY_BYTES = 4096;

module.exports = async function handler(req, res) {
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('X-Content-Type-Options', 'nosniff');

	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed.' });
	}

	const origin = req.headers.origin;
	const host = req.headers.host;
	if (origin && host) {
		try {
			if (new URL(origin).host !== host) {
				return res.status(403).json({ error: 'Cross-origin requests are not accepted.' });
			}
		} catch (error) {
			return res.status(403).json({ error: 'Invalid request origin.' });
		}
	}

	const contentLength = Number(req.headers['content-length'] || 0);
	if (contentLength > MAX_BODY_BYTES) {
		return res.status(413).json({ error: 'Feedback is too large.' });
	}

	const body = req.body && typeof req.body === 'object' ? req.body : {};
	if (typeof body.website === 'string' && body.website.trim()) {
		return res.status(204).end();
	}

	const rating = Number(body.rating);
	const mode = typeof body.mode === 'string' ? body.mode : '';
	const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

	if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
	}
	if (!ALLOWED_MODES.has(mode)) {
		return res.status(400).json({ error: 'Invalid tool mode.' });
	}
	if (comment.length > 1000) {
		return res.status(400).json({ error: 'Comment must be 1000 characters or fewer.' });
	}
	if (!process.env.DATABASE_URL) {
		return res.status(503).json({ error: 'Feedback storage is not configured.' });
	}

	try {
		const sql = neon(process.env.DATABASE_URL);
		await sql`
			INSERT INTO public.customer_feedback (rating, comment, tool_mode)
			VALUES (${rating}, ${comment || null}, ${mode})
		`;
		return res.status(201).json({ ok: true });
	} catch (error) {
		console.error('Feedback submission could not be stored.');
		return res.status(500).json({ error: 'Feedback could not be stored.' });
	}
};
