# Microservice Architecture Builder 🛠️

A drag-and-drop web app that helps developers **design**, **visualize** and
**share distributed application architectures** with a purpose-driven,
understandable interface.

![Image](https://github.com/user-attachments/assets/142c7b0a-2db5-46ce-af50-ba330f11a81a)

This project uses React, Vite, and React Flow. Try now
[live](https://microservice-architecture-builder.com).

## 🚀 Features

- **Service & Communication Representations**: Visualize different web services,
  annotate them with notes, and manage various communication types.

- **User-Friendly Design**: Enjoy an intuitive and interactive interface
  designed for ease of use.

- **Create and Share**: Users can create and share links to their projects for
  easy collaboration.

## 🎥 Quick Demo

https://github.com/user-attachments/assets/4dd64fdf-ea4c-44de-acde-d45bebc63073

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔑 Environment Variables

```bash
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
VITE_POSTHOG_REVERSE_PROXY_URL=
```

### Backend Database Environment Variables

For backend and tests, set these in your `.env` file:

```
# Main database for development/production
POSTGRES_DSN=host=localhost port=5432 user=postgres password=postgres dbname=mas sslmode=disable

# Separate test database (used by tests only)
POSTGRES_TEST_DSN=host=localhost port=5432 user=postgres password=postgres dbname=mas_test sslmode=disable
```

- The backend will use `POSTGRES_DSN` for normal operation.
- The test suite will use `POSTGRES_TEST_DSN` for isolation and safety.

No Supabase-specific environment variables are required unless you use Supabase as a direct PostgreSQL host (in which case, use the connection string they provide as your DSN).

## Database Configuration

This project uses a PostgreSQL database for all board data. You can use either a local PostgreSQL instance or a Supabase-hosted PostgreSQL instance by setting the `POSTGRES_DSN` environment variable.

### .env Example

```
# Local development
POSTGRES_DSN=host=localhost port=5432 user=postgres password=postgres dbname=mas sslmode=disable

# For Supabase, use the connection string from your Supabase dashboard:
# POSTGRES_DSN=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

- For local development, use the first line.
- For deployment on Supabase, copy your Supabase PostgreSQL connection string from the Supabase dashboard and set it as `POSTGRES_DSN`.

No code changes are needed to switch between local and Supabase—just update the environment variable.

## 🤝 Contributing

Contributions are welcome! If you have any ideas or improvements, feel free to
open a pull request.
