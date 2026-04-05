// Mock the repository first
jest.mock("../../src/api/v1/repositories/firestoreRepository");

import * as statService from "../../src/api/v1/services/statService";
import * as repository from "../../src/api/v1/repositories/firestoreRepository";
import { StatLine } from "../../src/api/v1/models/statModel";

jest.mock("../../src/api/v1/repositories/firestoreRepository");

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
            // Arrange
            (repository.queryDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result = await statService.getStatsByPlayerId("player123");

            // Assert
            expect(repository.queryDocuments).toHaveBeenCalledWith("stats", "playerId", "==", "player123");
            expect(result).toHaveLength(2);
        });
    });

    describe("getStatById", () => {
        it("should return stat when found", async () => {
            // Arrange
            const mockDoc = {
                exists: true,
                id: "stat123",
                data: () => ({ playerId: "player123", season: 2023, teamId: "team123", gamesPlayed: 150, atBats: 550, hits: 180, walks: 80, homeRuns: 40, runsBattedIn: 120, battingAverage: 0.327 }),
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            // Act
            const result = await statService.getStatById("stat123");

            // Assert
            expect(result?.season).toBe(2023);
        });

        it("should return null when stat not found", async () => {
            // Arrange
            (repository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result = await statService.getStatById("nonexistent");

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("createStat", () => {
        it("should create a new stat line for a player", async () => {
            // Arrange
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

            // Act
            const result = await statService.createStat("player123", statData);

            // Assert
            expect(repository.createDocument).toHaveBeenCalledWith("stats", { ...statData, playerId: "player123" });
            expect(result.playerId).toBe("player123");
        });
    });

    describe("updateStat", () => {
        it("should update stat and return updated stat", async () => {
            // Arrange
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

            // Act
            const result = await statService.updateStat("stat123", updateData);

            // Assert
            expect(result?.homeRuns).toBe(45);
        });
    });

    describe("deleteStat", () => {
        it("should delete stat and return true when found", async () => {
            // Arrange
            const mockDoc = { exists: true, id: "stat123", data: () => ({}) };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (repository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            // Act
            const result = await statService.deleteStat("stat123");

            // Assert
            expect(result).toBe(true);
        });
    });
});