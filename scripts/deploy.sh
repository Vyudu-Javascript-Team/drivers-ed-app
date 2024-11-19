#!/bin/bash

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Deploy to Netlify
netlify deploy --prod