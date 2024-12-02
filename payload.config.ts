const { buildConfig } = require('payload/config');
const path = require('path');
const Story = require('./collections/Story');
const Test = require('./collections/Test');
const Media = require('./collections/Media');
const Users = require('./collections/Users');
const lexicalEditor = require('@payloadcms/richtext-lexical').default;

module.exports = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: {
      features: {
        ssr: false,
      },
    },
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Story,
    Test,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
});
