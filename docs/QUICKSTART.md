# Driver's Ed Stories - Quick Start Guide

This guide will get you up and running with the Driver's Ed Stories platform in under 15 minutes.

## Prerequisites

Ensure you have:
- Node.js 18+
- Git
- Docker (optional, but recommended)

## Quick Setup

### 1. One-Line Setup (With Docker)
```bash
# Clone and setup with Docker
git clone https://gitlab.com/your-username/drivers-ed-stories.git && cd drivers-ed-app && docker-compose up -d && npm install && npm run dev
```

### 2. Manual Setup (Without Docker)

```bash
# Clone repository
git clone https://gitlab.com/your-username/drivers-ed-stories.git
cd drivers-ed-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Initialize databases
npx prisma generate
npx prisma db push
npm run payload generate:types

# Start development server
npm run dev
```

## Verify Installation

1. Open http://localhost:3000
2. Access admin panel at http://localhost:3000/admin
3. Try creating a test user account

## Common Issues & Solutions

### Database Connection Issues
```bash
# Reset database
npx prisma reset
npx prisma db push

# Check connections
nc -zv localhost 5432  # PostgreSQL
nc -zv localhost 27017 # MongoDB
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### CMS Issues
```bash
# Regenerate types
npm run payload generate:types

# Clear CMS cache
rm -rf payload/dist
```

## Next Steps

1. Read the full [SETUP.md](SETUP.md) for detailed configuration
2. Check [README.md](../README.md) for feature overview
3. Review [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines

## Quick Commands

```bash
# Development
npm run dev         # Start development server
npm test           # Run tests
npm run lint       # Run linter

# Database
npm run db:reset   # Reset database
npm run db:seed    # Seed sample data
npm run db:migrate # Run migrations

# Production
npm run build      # Build for production
npm start          # Start production server

# CMS
npm run cms:build  # Build CMS
npm run cms:dev    # Start CMS in dev mode
```

## Need Help?

- Check docs folder
- Create an issue
- Join developer chat
- Contact support team
