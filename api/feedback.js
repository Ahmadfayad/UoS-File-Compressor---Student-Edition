'use strict';

const { neon } = require('@neondatabase/serverless');

const ALLOWED_MODES = new Set(['compress', 'convert', 'merge', 'split']);
const MAX_BODY_BYTES = 4096;

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	})[character]);
}

async function sendFeedbackNotification({ rating, comment, mode }) {
	const apiKey = process.env.RESEND_API_KEY;
	const recipient = process.env.FEEDBACK_NOTIFICATION_EMAIL;
	const sender = process.env.FEEDBACK_FROM_EMAIL;
	if (!apiKey || !recipient || !sender) return false;

	const safeComment = comment ? escapeHtml(comment).replace(/\r?\n/g, '<br>') : '<em>No comment provided.</em>';
	const text = [
		`New customer satisfaction rating: ${rating}/5`,
		`Tool: ${mode}`,
		`Comment: ${comment || 'No comment provided.'}`,
	].join('\n');

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			signal: AbortSignal.timeout(5000),
			body: JSON.stringify({
				from: sender,
				to: [recipient],
				subject: `Customer satisfaction rating: ${rating}/5`,
				text,
				html: `<h2>New customer satisfaction rating: ${rating}/5</h2><p><strong>Tool:</strong> ${mode}</p><p><strong>Comment:</strong><br>${safeComment}</p>`,
			}),
		});
		if (!response.ok) throw new Error('Email provider rejected the notification.');
		return true;
	} catch (error) {
		console.error('Feedback notification email could not be sent.');
		return false;
	}
}

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
		await sendFeedbackNotification({ rating, comment, mode });
		return res.status(201).json({ ok: true });
	} catch (error) {
		console.error('Feedback submission could not be stored.');
		return res.status(500).json({ error: 'Feedback could not be stored.' });
	}
};

module.exports.sendFeedbackNotification = sendFeedbackNotification;
