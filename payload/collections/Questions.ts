import { CollectionConfig } from 'payload/types';

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'state', 'difficulty'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
    },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'explanation',
      type: 'textarea',
      required: true,
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Road Signs', value: 'road_signs' },
        { label: 'Traffic Laws', value: 'traffic_laws' },
        { label: 'Parking', value: 'parking' },
        { label: 'Safety', value: 'safety' },
      ],
      required: true,
    },
    {
      name: 'points',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 1,
    },
  ],
}