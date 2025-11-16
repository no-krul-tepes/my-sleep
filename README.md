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

2. Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then update the values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sleep_app

# Auth
AUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (see setup instructions below)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the application details:
   - **Application name**: Sleep Tracker (or any name you like)
   - **Homepage URL**: `http://localhost:3000` (for local dev)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy the **Client Secret**
7. Add both to your `.env` file

For production, create another OAuth App with your production domain:
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

### Generate Auth Secret

```bash
# Generate a random secret for NextAuth
openssl rand -base64 32
```

Add the generated secret to your `.env` file as `AUTH_SECRET`.

### Database Setup (IMPORTANT - Security)

**⚠️ For security reasons, database initialization must be done via CLI scripts, NOT through the web interface.**

Initialize the database schema (includes auth tables):

```bash
# Run migrations to create tables and indexes
bun run db:migrate
```

This will create:
- `sleep_logs` table for sleep data
- `users`, `accounts`, `sessions`, `verification_tokens` tables for authentication

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

### 1. Create Production GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in with **production** details:
   - **Application name**: Sleep Tracker Production
   - **Homepage URL**: `https://your-domain.vercel.app` (or your custom domain)
   - **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a new **Client Secret**

### 2. Set Environment Variables on Vercel

Go to your Vercel project settings → Environment Variables and add:

```env
# Database (use your production PostgreSQL URL)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
AUTH_SECRET=your-production-secret-from-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.vercel.app

# GitHub OAuth (production credentials from step 1)
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret

# Node Environment
NODE_ENV=production
```

**⚠️ IMPORTANT**:
- Use a **different** `AUTH_SECRET` than your local development
- Generate it with: `openssl rand -base64 32`
- Use the **production** GitHub OAuth credentials (not your dev ones)
- Make sure `NEXTAUTH_URL` matches your Vercel domain exactly

### 3. Run Database Migrations

After setting environment variables, you need to initialize the production database:

```bash
# Connect to your production database and run migrations
# Option 1: Using Vercel CLI
vercel env pull .env.production.local
bun run db:migrate

# Option 2: Or run migrations directly on your production DB
# (update DATABASE_URL to point to production)
```

### 4. Deploy

```bash
# Deploy to Vercel
vercel deploy --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
