# Sleep Logging App

A modern sleep tracking application built with Next.js 16, PostgreSQL, and Bun runtime.

## Features

- Track sleep sessions with start/end times
- Quality ratings and notes for each session
- Statistics and analytics dashboard
- Responsive UI with Tailwind CSS
- Type-safe API with Zod validation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **Charts**: Recharts
- **Date handling**: date-fns

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- PostgreSQL database
- Node.js >= 20.0.0 (for compatibility)

### Installation

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Create a `.env` file in the root directory with your database credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sleep_app
NODE_ENV=development
```

### Database Setup (IMPORTANT - Security)

**⚠️ For security reasons, database initialization must be done via CLI scripts, NOT through the web interface.**

Initialize the database schema:

```bash
# Run migrations to create tables and indexes
bun run db:migrate
```

Optional - Add sample data for testing:

```bash
# Seed the database with example sleep logs
bun run db:seed
```

### Development

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Production Build

```bash
bun run build
bun start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
