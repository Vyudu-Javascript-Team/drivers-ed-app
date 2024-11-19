# Driver's Ed Stories

A modern, gamified approach to learning driver's education through engaging stories.

## Getting Started

1. Clone the repository:
```bash
git clone https://gitlab.com/your-username/drivers-ed-stories.git
cd drivers-ed-stories
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. The deployment process is automated through GitLab CI/CD.

### Prerequisites

1. Create a Vercel account and project
2. Link your GitLab repository to Vercel
3. Configure the following environment variables in GitLab:
   - `VERCEL_TOKEN`
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID`

### Automatic Deployment

The project will automatically deploy to Vercel when changes are pushed to the main branch.

## Features

- Story-based learning for driver's education
- State-specific content (GA, FL, NJ, CA, LA)
- Interactive quizzes and progress tracking
- Achievement system and leaderboards
- Subscription management
- Admin dashboard

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Stripe
- TailwindCSS
- shadcn/ui

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a merge request

## License

MIT