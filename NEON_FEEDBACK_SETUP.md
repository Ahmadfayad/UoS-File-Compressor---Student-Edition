# Customer Feedback Setup

The feedback dialog appears after a successful compression, conversion, merge, or split. It submits only the star rating, optional comment, and tool mode. Files are not sent to the feedback endpoint. Vercel Web Analytics remains a separate project-level integration.

## Neon and Vercel

1. Create or link a Neon database to the Vercel project with the Neon integration.
2. In the Neon SQL Editor, run the contents of `feedback-schema.sql` once.
3. In Vercel Project Settings, add `DATABASE_URL` for Production and Preview. Use the Neon pooled connection string and keep it server-side; do not put it in `index.html` or commit it.
4. Deploy the project. Vercel detects `api/feedback.js` as a serverless function.
5. For local end-to-end testing, run `vercel dev` after linking the project and providing `DATABASE_URL` in the local Vercel environment.

If `DATABASE_URL` is missing or the schema has not been created, the endpoint rejects the submission with a generic error and the dialog offers retry. It never reports a submission as saved until Neon confirms the insert.

## KPI Queries

Average score by month:

```sql
SELECT date_trunc('month', created_at) AS month,
       round(avg(rating)::numeric, 2) AS average_rating,
       count(*) AS responses
FROM public.customer_feedback
GROUP BY 1
ORDER BY 1;
```

Rating distribution by tool:

```sql
SELECT tool_mode, rating, count(*) AS responses
FROM public.customer_feedback
GROUP BY tool_mode, rating
ORDER BY tool_mode, rating;
```

The prompt is shown at most once per browser every 30 days after dismissal or successful submission. This is a user-experience cooldown, not an identity or server-side anti-abuse guarantee. The API validates fields, enforces same-origin requests, limits payload size, and includes a honeypot field; it does not store IP addresses.
