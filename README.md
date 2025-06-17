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

## 🔑 Environment Variables with Local Development Value Sample (root .env)

```bash
# Frontend
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
VITE_POSTHOG_REVERSE_PROXY_URL=<frontend-url>/ingest
VITE_API_URL=

# Backend api
POSTGRES_DSN=host=db_local port=XXXX user=xxxxxxx password=xxxxxxx dbname=mas sslmode=disable
OAUTH_GOOGLE_ACCOUNT_BASE_URL=https://accounts.google.com
OAUTH_GOOGLE_BASE_URL=https://oauth2.googleapis.com
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_SECRET=
OAUTH_GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback
JWT_SECRET=
FRONTEND_URL=http://localhost:5173

# Postgres
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=


# PG admin
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

## 🏃‍♂️ Development Mode

To start the project in development mode (with hot reloading for both backend and frontend), simply run:

```bash
make dev
```

This command will start all necessary Docker containers for local development.

**Note:** Make sure you have the root `.env` file properly set up before running this command, as it is required for the services to start correctly.

## 🤝 Contributing

Contributions are welcome! If you have any ideas or improvements, feel free to
open a pull request.
