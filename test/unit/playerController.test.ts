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
jest.mock("../../src/api/v1/services/playerService");

import { Request, Response, NextFunction } from "express";
import * as playerController from "../../src/api/v1/controllers/playerController";
import * as playerService from "../../src/api/v1/services/playerService";

describe("Player Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockReq = { params: {}, body: {}, query: {} };
        mockRes = { status: statusMock };
        mockNext = jest.fn();
    });

    describe("getAllPlayers", () => {
        it("should return all players with status 200", async () => {
            const mockPlayers = [{ id: "1", firstName: "Aaron" }];
            (playerService.getAllPlayers as jest.Mock).mockResolvedValue(mockPlayers);

            await playerController.getAllPlayers(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(200);
        });

        it("should filter by teamId when query param provided", async () => {
            const mockPlayers = [{ id: "1", firstName: "Aaron" }];
            (playerService.getAllPlayers as jest.Mock).mockResolvedValue(mockPlayers);
            mockReq.query = { teamId: "team123" };

            await playerController.getAllPlayers(mockReq as Request, mockRes as Response, mockNext);

            expect(playerService.getAllPlayers).toHaveBeenCalledWith("team123");
        });
    });

    describe("getPlayerById", () => {
        it("should return player with status 200 when found", async () => {
            const mockPlayer = { id: "1", firstName: "Aaron" };
            (playerService.getPlayerById as jest.Mock).mockResolvedValue(mockPlayer);
            mockReq.params = { id: "1" };

            await playerController.getPlayerById(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(200);
        });

        it("should return 404 when player not found", async () => {
            (playerService.getPlayerById as jest.Mock).mockResolvedValue(null);
            mockReq.params = { id: "999" };

            await playerController.getPlayerById(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(404);
        });
    });

    describe("createPlayer", () => {
        it("should create player and return 201", async () => {
            const mockPlayer = { id: "1", firstName: "Aaron" };
            (playerService.createPlayer as jest.Mock).mockResolvedValue(mockPlayer);
            mockReq.body = { firstName: "Aaron" };

            await playerController.createPlayer(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(201);
        });
    });
});