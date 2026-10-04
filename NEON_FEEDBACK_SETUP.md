# Customer Feedback Setup

The feedback dialog appears shortly after a successful download, unless that browser dismissed the automatic survey for that service within the last 24 hours. The fixed bottom-corner **Share feedback** button is always available. A successful submission is limited to once per service per 24 hours in that browser; for example, a Compress rating does not prevent a Convert rating later that day. Reopening a service's survey during its cooldown shows a friendly confirmation instead. These experience-level cooldowns are stored per browser in local storage; they are not identity-based abuse prevention.

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

## Admin CSV Export

The admin page is available at `/admin.html`. It supports all records, the current UTC week/month/year, or an inclusive custom date range, with an optional service filter. Exported CSV includes the feedback ID, timestamp, rating, service, and comment. Formula-like comment values are neutralized for spreadsheet safety.

1. Generate a high-entropy access key locally, for example with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
2. In Vercel Project Settings > Environment Variables, add `ADMIN_ACCESS_KEY` for Production. Use the generated value directly in Vercel; do not paste it into this repository, the browser, or a chat.
3. Redeploy, then visit `https://uos-file-compressor.vercel.app/admin.html` and enter the key. It is kept only in memory for that page session; use **Lock admin page** or close the page to clear it.

Treat the admin key like a password and rotate it in Vercel if it is disclosed. The key grants read/export access to feedback, including optional comments. Consider restricting the deployment with Vercel access controls if the admin page should be private to an organization.

Automatic prompting is limited to once per browser per service every 24 hours after dismissal; successful submissions are also limited per service per browser every 24 hours. Clearing browser storage can reset these client-side limits. The API validates fields, enforces same-origin requests, limits payload size, and includes a honeypot field; it does not store IP addresses.
