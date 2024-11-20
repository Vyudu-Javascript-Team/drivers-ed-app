# Driver's Ed Stories Application

A modern, interactive platform for driver's education featuring stories, quizzes, and adaptive learning.

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

Required configurations:
- `DATABASE_URL`: PostgreSQL connection string
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: JWT secret for authentication
- `PAYLOAD_SECRET`: Secret key for Payload CMS (min 32 characters)
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `S3_*`: AWS S3 credentials for media storage
- `UPSTASH_REDIS_*`: Upstash Redis credentials for caching

5. Initialize the database:
```bash
npx prisma migrate deploy
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

## 🏗 Architecture

- **Frontend**: Next.js 14 with App Router
- **Admin Panel**: Payload CMS
- **Database**: PostgreSQL (main data) + MongoDB (CMS)
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Caching**: Upstash Redis
- **Payments**: Stripe

## 🔧 Third-Party Service Setup

### 1. Stripe Integration
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints:
   - Test webhook: `http://localhost:3000/api/webhooks/stripe`
   - Production webhook: `https://yourdomain.com/api/webhooks/stripe`
4. Configure webhook events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 2. AWS S3 Setup
1. Create an AWS account
2. Create an S3 bucket
3. Configure CORS policy for your bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```
4. Create IAM user with S3 access
5. Add credentials to .env file

### 3. Upstash Redis Setup
1. Create account at https://upstash.com
2. Create a Redis database
3. Copy REST URL and token to .env file

## 📁 Project Structure

```
drivers-ed-app/
├── app/                    # Next.js app router pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── collections/          # Payload CMS collections
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔐 Security Considerations

1. **API Keys**: Never commit API keys to the repository
2. **Environment Variables**: Use different values for development and production
3. **File Upload**: Implement file type validation and size limits
4. **Rate Limiting**: Implement rate limiting on API routes
5. **Authentication**: Secure all admin routes and API endpoints

## 🚀 Deployment Checklist

1. Configure production environment variables
2. Run database migrations
3. Set up SSL certificate
4. Configure domain and DNS settings
5. Set up monitoring and error tracking
6. Configure backup strategy
7. Test payment system in production mode

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3)
- [Upstash Documentation](https://docs.upstash.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📝 License

This project is proprietary and confidential.