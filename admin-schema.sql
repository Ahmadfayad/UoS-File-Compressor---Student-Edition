CREATE TABLE IF NOT EXISTS public.feedback_admin_sessions (
 token_hash VARCHAR(64) PRIMARY KEY,
 credential_fingerprint VARCHAR(64) NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS public.feedback_admin_login_limits (
 bucket VARCHAR(64) PRIMARY KEY,
 attempts INTEGER NOT NULL,
 reset_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS public.feedback_admin_users (
 email VARCHAR(254) PRIMARY KEY,
 password_hash VARCHAR(128) NOT NULL,
 password_salt VARCHAR(64) NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.feedback_admin_sessions ADD COLUMN IF NOT EXISTS user_email VARCHAR(254);
