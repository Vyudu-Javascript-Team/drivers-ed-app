// Mock payload client for development
const mockPayloadClient = {
  find: async () => ({ docs: [] }),
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
};

export const getPayloadClient = async () => {
  return mockPayloadClient;
};