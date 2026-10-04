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
