// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Mock the entire firebaseConfig module
jest.mock("../config/firebaseConfig", () => {
    const mockDb = {
        collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
                get: jest.fn(),
                set: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            }),
            add: jest.fn(),
            get: jest.fn(),
            where: jest.fn().mockReturnThis(),
        }),
        runTransaction: jest.fn(),
        batch: jest.fn().mockReturnValue({
            commit: jest.fn(),
            delete: jest.fn(),
        }),
    };
    
    return {
        db: mockDb,
    };
});

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn(),
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    queryDocuments: jest.fn(),
}));