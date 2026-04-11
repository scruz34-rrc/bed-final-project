// Mock firebaseConfig FIRST - before any other imports
jest.mock("../../config/firebaseConfig", () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ docs: [] }),
        add: jest.fn().mockResolvedValue({ id: "mock-id" }),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
        where: jest.fn().mockReturnThis(),
    },
    auth: {
        verifyIdToken: jest.fn().mockResolvedValue({ uid: "test-uid" }),
    },
}));

// Mock the repository
jest.mock("../../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn().mockResolvedValue("mock-id"),
    getDocuments: jest.fn().mockResolvedValue({ docs: [] }),
    getDocumentById: jest.fn().mockResolvedValue(null),
    updateDocument: jest.fn().mockResolvedValue(undefined),
    deleteDocument: jest.fn().mockResolvedValue(undefined),
    queryDocuments: jest.fn().mockResolvedValue({ docs: [] }),
}));

// Mock the service
jest.mock("../../src/api/v1/services/statService");

import { Request, Response, NextFunction } from "express";
import * as statController from "../../src/api/v1/controllers/statController";
import * as statService from "../../src/api/v1/services/statService";

describe("Stat Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockReq = { params: {}, body: {} };
        mockRes = { status: statusMock };
        mockNext = jest.fn();
    });

    describe("getStatById", () => {
        it("should return 404 when stat not found", async () => {
            (statService.getStatById as jest.Mock).mockResolvedValue(null);
            mockReq.params = { id: "999" };

            await statController.getStatById(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(404);
        });
    });
});