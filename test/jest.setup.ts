// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Set required Firebase environment variables for tests
process.env.FIREBASE_PROJECT_ID = "test-project";
process.env.FIREBASE_CLIENT_EMAIL = "test@example.com";
process.env.FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n";
process.env.NODE_ENV = "test";

// Mock the entire firebase-admin modules BEFORE anything imports them
jest.mock("firebase-admin/app", () => ({
    initializeApp: jest.fn(),
    cert: jest.fn(),
    getApps: jest.fn().mockReturnValue([]),
}));

jest.mock("firebase-admin/firestore", () => ({
    getFirestore: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ docs: [] }),
        add: jest.fn().mockResolvedValue({ id: "mock-id" }),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
        where: jest.fn().mockReturnThis(),
        runTransaction: jest.fn(),
        batch: jest.fn().mockReturnValue({
            commit: jest.fn(),
            delete: jest.fn(),
        }),
    }),
}));

jest.mock("firebase-admin/auth", () => ({
    getAuth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: "test-uid" }),
        getUser: jest.fn().mockResolvedValue({ uid: "test-uid", email: "test@example.com" }),
        setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    }),
}));

// Now mock the firebaseConfig module
jest.mock("../config/firebaseConfig", () => {
    const mockDb = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ docs: [] }),
        add: jest.fn().mockResolvedValue({ id: "mock-id" }),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
        where: jest.fn().mockReturnThis(),
        runTransaction: jest.fn(),
        batch: jest.fn().mockReturnValue({
            commit: jest.fn(),
            delete: jest.fn(),
        }),
    };
    
    const mockAuth = {
        verifyIdToken: jest.fn().mockResolvedValue({ uid: "test-uid" }),
        getUser: jest.fn().mockResolvedValue({ uid: "test-uid", email: "test@example.com" }),
        setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    };
    
    return {
        db: mockDb,
        auth: mockAuth,
    };
});

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn().mockResolvedValue("mock-id"),
    getDocuments: jest.fn().mockResolvedValue({ docs: [] }),
    getDocumentById: jest.fn().mockResolvedValue(null),
    updateDocument: jest.fn().mockResolvedValue(undefined),
    deleteDocument: jest.fn().mockResolvedValue(undefined),
    queryDocuments: jest.fn().mockResolvedValue({ docs: [] }),
}));

// Silence console logs during tests
global.console.log = jest.fn();
global.console.error = jest.fn();