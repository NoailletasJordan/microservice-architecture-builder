-- Table: public.boards

CREATE TABLE IF NOT EXISTS public.boards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    data TEXT NOT NULL,
    password TEXT,
    deleted TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_boards_deleted ON public.boards(deleted); 