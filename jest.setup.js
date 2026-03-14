const store = {};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    return Promise.resolve();
  }),
}));

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  function mockCreateQueryChain() {
    const chain = {
      select: jest.fn(() => chain),
      insert: jest.fn(() => chain),
      delete: jest.fn(() => chain),
      upsert: jest.fn(() => chain),
      update: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      order: jest.fn(() => chain),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      maybeSingle: jest.fn(() =>
        Promise.resolve({ data: null, error: null }),
      ),
      then(resolve) {
        return Promise.resolve({ data: [], error: null }).then(resolve);
      },
    };
    return chain;
  }

  return {
    createClient: jest.fn(() => ({
      auth: {
        getSession: jest.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "test-user-id" } } },
          }),
        ),
        signInAnonymously: jest.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "test-user-id" } } },
            error: null,
          }),
        ),
        getUser: jest.fn(() =>
          Promise.resolve({
            data: { user: { id: "test-user-id" } },
            error: null,
          }),
        ),
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } },
        })),
      },
      from: jest.fn(() => mockCreateQueryChain()),
    })),
  };
});
