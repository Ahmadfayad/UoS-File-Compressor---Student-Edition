# Customer Feedback Setup

The feedback dialog appears shortly after a successful download, unless that browser dismissed the automatic survey within the last 24 hours. The fixed bottom-corner **Share feedback** button is always available. After a successful submission, that browser cannot submit another rating for 24 hours; reopening the survey shows a friendly confirmation instead. These cooldowns are stored per browser in local storage.

The survey submits only the star rating, optional comment, and tool mode. Files are not sent to the feedback endpoint. Vercel Web Analytics remains a separate project-level integration.

## Neon and Vercel

1. Create or link a Neon database to the Vercel project with the Neon integration.
2. In the Neon SQL Editor, run the contents of `feedback-schema.sql` once.
3. In Vercel Project Settings, add `DATABASE_URL` for Production and Preview. Use the Neon pooled connection string and keep it server-side; do not put it in `index.html` or commit it.
4. Deploy the project. Vercel detects `api/feedback.js` as a serverless function.
5. For local end-to-end testing, run `vercel dev` after linking the project and providing `DATABASE_URL` in the local Vercel environment.

If `DATABASE_URL` is missing or the schema has not been created, the endpoint rejects the submission with a generic error and the dialog offers retry. It never reports a submission as saved until Neon confirms the insert.

## Email Notifications with Resend

The endpoint sends an email after Neon confirms each rating, when all of these Vercel environment variables are configured:

- `RESEND_API_KEY`: create an API key in your Resend account and add it as a Vercel secret.
- `FEEDBACK_NOTIFICATION_EMAIL`: the inbox that should receive ratings.
- `FEEDBACK_FROM_EMAIL`: a sender address on a domain verified in Resend, for example `UoS Feedback <feedback@your-verified-domain.example>`.

Add the values in Vercel Project Settings > Environment Variables for Production (and Preview if you want preview emails), then redeploy. Do not put the API key in `index.html`, the feedback request, or source control. Email is optional: ratings continue to be stored if the mail provider is unavailable, and a notification failure does not lose a saved response. The email includes the rating, tool mode, and optional comment; comments are escaped before HTML rendering.

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

Automatic prompting is limited to once per browser every 24 hours after dismissal. Successful submissions are also limited to once per browser every 24 hours. This is a user-experience guard, not a strong identity-based or server-side abuse guarantee; clearing browser storage can reset it. The API validates fields, enforces same-origin requests, limits payload size, and includes a honeypot field; it does not store IP addresses.
