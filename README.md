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

### Backend Supabase Environment Variables

For production, set these in your `.env` file:

```
SUPABASE_URL=
SUPABASE_PUBLIC_ANON_KEY=
SUPABASE_PROJECT_ID=
```

For backend tests, set the following in your `.env` file. These will be used automatically when running `go test`:

```
TEST_SUPABASE_URL=
TEST_SUPABASE_PUBLIC_ANON_KEY=
TEST_SUPABASE_PROJECT_ID=
```

**How it works:**

- When running backend tests, the test runner will override the production Supabase environment variables with the test equivalents if they are set.
- All backend code will transparently use the test Supabase project for all database operations during tests.
- The test database is not initialized with schema or seed data by the test runner, and is cleaned after each test run.

## 🤝 Contributing

Contributions are welcome! If you have any ideas or improvements, feel free to
open a pull request.
