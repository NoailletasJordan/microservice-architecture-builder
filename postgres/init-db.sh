#!/bin/bash
set -e

# Wait until PostgreSQL is ready
# until pg_isready -U "${POSTGRES_USER:-postgres}" -h localhost; do
#   echo "Waiting for PostgreSQL to be ready..."
#   sleep 1
# done

# Run SQL in the default database
echo "Running schema in default database..."
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-postgres}" --dbname "${POSTGRES_DB:-postgres}" <<-EOSQL
  CREATE TABLE IF NOT EXISTS public.boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      owner UUID NOT NULL REFERENCES public.users(id),
      data TEXT NOT NULL,
      password TEXT,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL,
      share_fragment TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_boards_deleted_at ON public.boards(deleted_at);

  CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL,
      provider TEXT NOT NULL,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
EOSQL

# Check if test database exists, create if it doesn't
echo "Creating test database..."
psql -U "${POSTGRES_USER:-postgres}" -tAc "SELECT 1 FROM pg_database WHERE datname='test'" | grep -q 1 || createdb -U "${POSTGRES_USER:-postgres}" test

# Run the same SQL in test
echo "Running schema in test..."
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-postgres}" --dbname "test" <<-EOSQL
  CREATE TABLE IF NOT EXISTS public.boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      owner UUID NOT NULL REFERENCES public.users(id),
      data TEXT NOT NULL,
      password TEXT,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL,
      share_fragment TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_boards_deleted_at ON public.boards(deleted_at);

  CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL,
      provider TEXT NOT NULL,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
EOSQL