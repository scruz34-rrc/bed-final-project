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
jest.mock("../../src/api/v1/services/teamService");

import { Request, Response, NextFunction } from "express";
import * as teamController from "../../src/api/v1/controllers/teamController";
import * as teamService from "../../src/api/v1/services/teamService";

describe("Team Controller", () => {
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

    describe("getAllTeams", () => {
        it("should return all teams with status 200", async () => {
            const mockTeams = [{ id: "1", name: "Yankees" }];
            (teamService.getAllTeams as jest.Mock).mockResolvedValue(mockTeams);

            await teamController.getAllTeams(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(200);
        });
    });

    describe("getTeamById", () => {
        it("should return 404 when team not found", async () => {
            (teamService.getTeamById as jest.Mock).mockResolvedValue(null);
            mockReq.params = { id: "999" };

            await teamController.getTeamById(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(404);
        });
    });
});