import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import path from 'path';

// Import collections
import { Stories } from './collections/Stories';
import { Questions } from './collections/Questions';
import { States } from './collections/States';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- DriversEd Stories',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  collections: [
    Users,
    Stories,
    Questions,
    States,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: 's3',
          config: {
            bucket: process.env.S3_BUCKET,
            prefix: 'media',
          },
        },
      },
    }),
  ],
});