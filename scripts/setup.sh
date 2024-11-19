#!/bin/bash

# Create .env.local from example if it doesn't exist
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from example"
fi

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data
npx prisma db seed

echo "Setup complete! Run 'npm run dev' to start the development server"