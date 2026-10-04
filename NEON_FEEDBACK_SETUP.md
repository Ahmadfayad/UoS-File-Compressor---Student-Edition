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

## Administrator sign-in and reports

The administrator page is `/admin.html`. Only the email configured in `ADMIN_EMAIL` can sign in. Reports include CSV and Excel (.xlsx), historical weekly/monthly/yearly periods, inclusive custom dates, and service filters. Calendar periods default to Dubai time (UTC+4); UTC is also available. Weeks begin Monday. Export timestamps use UTC.

1. Run `admin-schema.sql` in the existing Neon database.
2. Set `ADMIN_EMAIL` in Vercel for Production.
3. Enter a unique password of 6–256 characters directly into a sensitive Production variable named `ADMIN_PASSWORD`. Never commit it, print it, or paste it into chat.
4. Redeploy and sign in at `/admin.html`.

The password stays on the server. Hashed random sessions use a Secure, HttpOnly, SameSite=Strict cookie and expire after four hours. Sign out revokes the session. Changing credentials and redeploying invalidates existing sessions. To reset a forgotten password, replace `ADMIN_PASSWORD` in Vercel and redeploy. There is no public registration. Sign-in attempts are limited per hashed IP and globally in separate admin tables. Feedback rows do not contain IP addresses.

`ADMIN_ACCESS_KEY` is no longer used. Configure Preview credentials only if Preview should access feedback. CSV formula-like values are neutralized; Excel comments are stored as text.

Automatic prompting is limited to once per browser per service every 24 hours after dismissal; successful submissions are also limited per service per browser every 24 hours. Clearing browser storage can reset these client-side limits. The API validates fields, enforces same-origin requests, limits payload size, and includes a honeypot field; it does not store IP addresses.

## Authorized users

The owner configured in Vercel can add authorized users at /admin.html with an email and a unique password of at least 6 characters. Added users can read and export feedback but cannot manage accounts. Passwords are stored as salted scrypt hashes in Neon, never returned by the API. Owner controls allow password reset, restore, and revoke. Reset or revoke immediately invalidates that user's existing sessions. New users are not automatically emailed; share credentials privately. Apply the complete admin-schema.sql for the users table and session email column. The owner credentials remain in Vercel.
