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

Follow these steps to set up and run the microservice architecture locally:

1. **Prerequisites**

- [Docker](https://www.docker.com/) (required for container orchestration)
- [Make](https://www.gnu.org/software/make/) (required for build automation)
- [Go 1.23+](https://go.dev/dl/) (required for backend services)
- [Node 20+](https://nodejs.org/en/download/) (required for frontend services)
- [Bun (latest)](https://bun.sh/) (recommended for frontend; npm is also supported with minor modifications)

2. **Repository Setup**

   Clone the repository to your local machine.

3. **Environment Configuration**

   Create a `.env` file in the root directory with the required environment variables.

4. **Frontend Dependencies**

   Install frontend dependencies using the provided Makefile:

   ```bash
   make install
   ```

5. **(Optional) Testing Setup**

   Install Playwright browsers and run tests to verify the setup:

   ```bash
   cd frontend
   bunx playwright install --with-deps
   make test-f
   ```

6. **Google OAuth2 Configuration**

   Create a project in the Google Cloud Console for OAuth2 authentication:

   - Origin URI: `http://localhost:6006`
   - Redirect URI: `http://localhost:6006/auth/google/callback`

   Ensure these values are reflected in your `.env` file.

7. **Start Services**

   Start all services using Docker:

   ```bash
   make dev
   ```

   This command will:

   - Build and start all required services
   - Expose the frontend at `http://localhost:6005`

## 🔑 Environment Variables with Local Development Value Sample (root .env)

With default ports for services:

- frontend: 6005
- backend (api): 6006
- postgres: 6007
- mock-oauth: 6008
- pgadmin: 6009

```bash
# Frontend
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
VITE_POSTHOG_REVERSE_PROXY_URL=http://localhost:6005/ingest
VITE_API_URL=http://localhost:6006

# Backend api
POSTGRES_DSN=host=db_local port=6007 user=postgres password=postgres dbname=mas sslmode=disable
OAUTH_GOOGLE_ACCOUNT_BASE_URL=https://accounts.google.com
OAUTH_GOOGLE_BASE_URL=https://oauth2.googleapis.com
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_SECRET=
JWT_SECRET=PommeDePain
FRONTEND_URL=http://localhost:6005

# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mas


# PG admin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

## 🤝 Contributing

Contributions are welcome! If you have any ideas or improvements, feel free to
open a pull request.

## 📝 License

It is source-available for **educational and personal use only**.

Redistribution or commercial use is strictly prohibited.

For permission requests, please contact the author.
