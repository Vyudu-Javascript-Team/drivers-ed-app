# Driver's Ed Stories

A modern, gamified approach to learning driver's education through engaging stories. Built with Next.js 14, Payload CMS, and a dual database architecture (PostgreSQL + MongoDB).

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **CMS**: Payload CMS 2.0
- **Primary Database**: PostgreSQL (User data, progress)
- **CMS Database**: MongoDB (Content management)
- **Caching**: Upstash Redis
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **File Storage**: AWS S3
- **Deployment**: Vercel

## 🛠 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database
- MongoDB database
- Redis instance (Upstash)
- AWS S3 bucket
- Stripe account
- Google OAuth credentials (for authentication)

## 🔧 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/your-username/drivers-ed-stories.git
   cd drivers-ed-stories
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Required environment variables:
   ```env
   # Database URLs
   DATABASE_URL="postgresql://user:password@localhost:5432/driversed"
   MONGODB_URI="mongodb://localhost:27017/driversed"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Payload CMS
   PAYLOAD_SECRET="your-payload-secret"
   NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

   # Redis
   UPSTASH_REDIS_REST_URL="your-redis-url"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret"
   STRIPE_WEBHOOK_SECRET="your-webhook-secret"
   STRIPE_PRICE_ID="your-price-id"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-publishable-key"

   # AWS S3
   S3_BUCKET="your-bucket-name"
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="your-region"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # Generate Payload types
   npm run payload generate:types
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📦 Production Deployment

### Vercel Deployment (Recommended)

1. **Fork the repository to your GitLab account**

2. **Create a new project in Vercel**
   - Connect your GitLab repository
   - Add all environment variables from `.env.local`
   - Enable automatic deployments

3. **Database Setup**
   - Set up a managed PostgreSQL database (e.g., Supabase, Railway)
   - Set up a MongoDB instance (e.g., MongoDB Atlas)
   - Update the database connection strings in Vercel environment variables

4. **Redis Setup**
   - Create a Redis instance on Upstash
   - Add Redis credentials to Vercel environment variables

5. **S3 Setup**
   - Create an S3 bucket for media storage
   - Configure CORS for your domain
   - Add AWS credentials to Vercel environment variables

6. **Stripe Setup**
   - Set up Stripe webhook endpoint
   - Add Stripe credentials to Vercel environment variables

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔄 CI/CD Pipeline

The repository includes a GitLab CI/CD configuration that:
- Runs tests
- Checks code quality
- Builds the application
- Deploys to Vercel

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📝 Content Management

1. **Access the CMS**
   - Visit `/admin` on your deployed site
   - Log in with admin credentials

2. **Content Types**
   - Stories: Interactive learning content
   - Questions: Test questions and answers
   - States: State-specific content
   - Media: Images and videos

## 🔐 Security Considerations

- All API routes are rate-limited
- Authentication uses secure sessions
- File uploads are validated and sanitized
- Database queries are protected against injection
- Security headers are implemented
- CORS is properly configured

## 🚨 Troubleshooting

Common issues and solutions:

1. **Database Connection Issues**
   - Check connection strings
   - Verify network access
   - Check firewall settings

2. **Build Errors**
   - Clear `.next` directory
   - Delete `node_modules` and reinstall
   - Check Node.js version

3. **CMS Issues**
   - Verify MongoDB connection
   - Check Payload secret
   - Ensure proper file permissions

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

Built with ❤️ by the Driver's Ed Stories team