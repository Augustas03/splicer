import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    // Mock app instance
  }))
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    // Mock firestore instance
  })),
  connectFirestoreEmulator: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    // Mock auth instance
  })),
  connectAuthEmulator: jest.fn()
}));

describe('Firebase Database Connection', () => {
  // Mock console.log to clean up test output
  const originalConsoleLog = console.log;
  beforeAll(() => {
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment before each test
    process.env = {
      ...process.env,
      REACT_APP_FIREBASE_API_KEY: 'test-api-key',
      REACT_APP_FIREBASE_AUTH_DOMAIN: 'test-domain',
      REACT_APP_FIREBASE_PROJECT_ID: 'test-project',
      REACT_APP_FIREBASE_STORAGE_BUCKET: 'test-bucket',
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
      REACT_APP_FIREBASE_APP_ID: 'test-app-id',
      REACT_APP_ENV: 'development'
    };
  });

  it('initializes Firebase with correct config', () => {
    jest.isolateModules(() => {
      require('./dbConnection');
      
      expect(initializeApp).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        authDomain: 'test-domain',
        projectId: 'test-project',
        storageBucket: 'test-bucket',
        messagingSenderId: 'test-sender',
        appId: 'test-app-id'
      });
    });
  });

  it('initializes Firestore and Auth', () => {
    jest.isolateModules(() => {
      require('./dbConnection');
      
      expect(getFirestore).toHaveBeenCalled();
      expect(getAuth).toHaveBeenCalled();
    });
  });

  it('does not connect to emulators in production', () => {
    process.env.REACT_APP_ENV = 'production';
    
    jest.isolateModules(() => {
      require('./dbConnection');
      
      expect(connectFirestoreEmulator).not.toHaveBeenCalled();
      expect(connectAuthEmulator).not.toHaveBeenCalled();
    });
  });
});