import { CollectionConfig } from 'payload/types';

export const States: CollectionConfig = {
  slug: 'states',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      maxLength: 2,
      admin: {
        description: 'Two-letter state code (e.g., GA, FL)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this state is currently available',
      },
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'testingRules',
      type: 'richText',
      admin: {
        description: 'State-specific testing rules and requirements',
      },
    },
  ],
}