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
# Local PostgreSQL data directory (created and managed by Docker, db_local is the service name)
POSTGRES_DSN=host=db_local port=5432 user=postgres password=postgres dbname=database sslmode=disable

# For running tests, use the same connection string but set dbname to 'test' (enforced):
POSTGRES_DSN=host=db_local port=5432 user=postgres password=postgres dbname=test sslmode=disable

VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
VITE_POSTHOG_REVERSE_PROXY_URL=<frontend-url>/ingest
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
