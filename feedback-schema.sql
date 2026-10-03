CREATE TABLE IF NOT EXISTS public.customer_feedback (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1000),
    tool_mode VARCHAR(16) NOT NULL CHECK (tool_mode IN ('compress', 'convert', 'merge', 'split')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customer_feedback_created_at_idx
    ON public.customer_feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS customer_feedback_mode_created_at_idx
    ON public.customer_feedback (tool_mode, created_at DESC);
