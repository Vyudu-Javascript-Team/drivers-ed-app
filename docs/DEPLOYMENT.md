# Deployment Guide

## Prerequisites

1. Vercel Account
2. PostgreSQL Database
3. Google OAuth Credentials
4. Stripe Account
5. GitLab Account

## Environment Variables

Ensure all environment variables are set in Vercel:

```bash
# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Stripe
STRIPE_SECRET_KEY=your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_PRICE_ID=your-price-id
```

## Deployment Steps

1. Connect your GitLab repository to Vercel
2. Configure environment variables in Vercel
3. Set up database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Configure Stripe webhooks to point to:
   ```
   https://your-domain.com/api/webhook
   ```

## Post-Deployment

1. Verify OAuth login works
2. Test Stripe payments
3. Check database connections
4. Verify email sending

## Monitoring

- Set up Vercel Analytics
- Configure error tracking
- Monitor database performance

## Troubleshooting

Common issues and solutions:
1. Database connection errors
2. OAuth configuration issues
3. Stripe webhook failures