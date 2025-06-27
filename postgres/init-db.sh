#!/bin/bash
set -e

# Run SQL in the default database
echo "Running schema in default database..."
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-postgres}" --dbname "${POSTGRES_DB:-postgres}" <<-EOSQL
  CREATE TABLE IF NOT EXISTS public.users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      provider TEXT NOT NULL,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

  CREATE TABLE IF NOT EXISTS public.boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      owner TEXT NOT NULL REFERENCES public.users(id),
      data TEXT NOT NULL,
      password TEXT,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL,
      share_fragment TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_boards_deleted_at ON public.boards(deleted_at);
EOSQL