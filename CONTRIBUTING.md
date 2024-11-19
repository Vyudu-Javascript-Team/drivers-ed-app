# Contributing to Driver's Ed Stories

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://gitlab.com/your-username/drivers-ed-stories.git
```

3. Install dependencies:
```bash
npm install
```

4. Create a branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

5. Set up environment variables:
```bash
cp .env.example .env.local
```

6. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Development Workflow

1. Make your changes
2. Run tests:
```bash
npm run test
npm run lint
```

3. Commit your changes:
```bash
git add .
git commit -m "feat: add your feature"
```

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Create a merge request

## Code Style

- Follow the existing code style
- Use TypeScript
- Write tests for new features
- Update documentation as needed

## Database Changes

1. Create a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

2. Update seed data if necessary
3. Test migrations locally
4. Include migrations in your merge request

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

The application is automatically deployed to Vercel through GitLab CI/CD.

## Need Help?

Create an issue or contact the maintainers.