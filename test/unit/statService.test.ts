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
jest.mock("../../src/api/v1/repositories/firestoreRepository");

import * as statService from "../../src/api/v1/services/statService";
import * as repository from "../../src/api/v1/repositories/firestoreRepository";
import { StatLine } from "../../src/api/v1/models/statModel";

describe("StatService", () => {
    let mockStat: StatLine;
    let mockSnapshot: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockStat = {
            id: "stat123",
            playerId: "player123",
            season: 2023,
            teamId: "team123",
            gamesPlayed: 150,
            atBats: 550,
            hits: 180,
            walks: 80,
            homeRuns: 40,
            runsBattedIn: 120,
            battingAverage: 0.327,
        };
        
        mockSnapshot = {
            docs: [
                { id: "stat123", data: () => ({ playerId: "player123", season: 2023, teamId: "team123", gamesPlayed: 150, atBats: 550, hits: 180, walks: 80, homeRuns: 40, runsBattedIn: 120, battingAverage: 0.327 }) },
                { id: "stat456", data: () => ({ playerId: "player123", season: 2022, teamId: "team123", gamesPlayed: 140, atBats: 500, hits: 150, walks: 70, homeRuns: 35, runsBattedIn: 100, battingAverage: 0.300 }) },
            ],
        };
    });

    describe("getStatsByPlayerId", () => {
        it("should return all stats for a player", async () => {
            (repository.queryDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await statService.getStatsByPlayerId("player123");

            expect(repository.queryDocuments).toHaveBeenCalledWith("stats", "playerId", "==", "player123");
            expect(result).toHaveLength(2);
        });
    });

    describe("getStatById", () => {
        it("should return stat when found", async () => {
            const mockDoc = {
                exists: true,
                id: "stat123",
                data: () => ({ playerId: "player123", season: 2023, teamId: "team123", gamesPlayed: 150, atBats: 550, hits: 180, walks: 80, homeRuns: 40, runsBattedIn: 120, battingAverage: 0.327 }),
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await statService.getStatById("stat123");

            expect(result?.season).toBe(2023);
        });

        it("should return null when stat not found", async () => {
            (repository.getDocumentById as jest.Mock).mockResolvedValue(null);

            const result = await statService.getStatById("nonexistent");

            expect(result).toBeNull();
        });
    });

    describe("createStat", () => {
        it("should create a new stat line for a player", async () => {
            const statData = {
                season: 2023,
                teamId: "team123",
                gamesPlayed: 150,
                atBats: 550,
                hits: 180,
                walks: 80,
                homeRuns: 40,
                runsBattedIn: 120,
                battingAverage: 0.327,
            };
            (repository.createDocument as jest.Mock).mockResolvedValue("newStat123");

            const result = await statService.createStat("player123", statData);

            expect(repository.createDocument).toHaveBeenCalledWith("stats", { ...statData, playerId: "player123" });
            expect(result.playerId).toBe("player123");
        });
    });

    describe("updateStat", () => {
        it("should update stat and return updated stat", async () => {
            const updateData = { homeRuns: 45 };
            const mockDoc = {
                exists: true,
                id: "stat123",
                data: () => ({ playerId: "player123", season: 2023, teamId: "team123", gamesPlayed: 150, atBats: 550, hits: 180, walks: 80, homeRuns: 40, runsBattedIn: 120, battingAverage: 0.327 }),
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (repository.updateDocument as jest.Mock).mockResolvedValue(undefined);
            
            const updatedMockDoc = {
                exists: true,
                id: "stat123",
                data: () => ({ playerId: "player123", season: 2023, teamId: "team123", gamesPlayed: 150, atBats: 550, hits: 180, walks: 80, homeRuns: 45, runsBattedIn: 120, battingAverage: 0.327 }),
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValueOnce(mockDoc);
            (repository.getDocumentById as jest.Mock).mockResolvedValueOnce(updatedMockDoc);

            const result = await statService.updateStat("stat123", updateData);

            expect(result?.homeRuns).toBe(45);
        });
    });

    describe("deleteStat", () => {
        it("should delete stat and return true when found", async () => {
            const mockDoc = { exists: true, id: "stat123", data: () => ({}) };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (repository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            const result = await statService.deleteStat("stat123");

            expect(result).toBe(true);
        });
    });
});