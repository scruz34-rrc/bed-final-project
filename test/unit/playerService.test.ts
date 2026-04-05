// Mock the repository FIRST - before any imports
jest.mock("../../src/api/v1/repositories/firestoreRepository");

import * as playerService from "../../src/api/v1/services/playerService";
import * as repository from "../../src/api/v1/repositories/firestoreRepository";

describe("PlayerService", () => {
    let mockSnapshot: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockSnapshot = {
            docs: [
                { id: "player123", data: () => ({ firstName: "Aaron", lastName: "Judge", position: "RF", teamId: "team123", debutYear: 2016, isActive: true }) },
                { id: "player456", data: () => ({ firstName: "Giancarlo", lastName: "Stanton", position: "DH", teamId: "team123", debutYear: 2010, isActive: true }) },
            ],
        };
    });

    describe("getAllPlayers", () => {
        it("should return all players when no teamId filter", async () => {
            (repository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await playerService.getAllPlayers();

            expect(repository.getDocuments).toHaveBeenCalledWith("players");
            expect(result).toHaveLength(2);
        });

        it("should return filtered players when teamId provided", async () => {
            const filteredSnapshot = { docs: [mockSnapshot.docs[0]] };
            (repository.queryDocuments as jest.Mock).mockResolvedValue(filteredSnapshot);

            const result = await playerService.getAllPlayers("team123");

            expect(repository.queryDocuments).toHaveBeenCalledWith("players", "teamId", "==", "team123");
            expect(result).toHaveLength(1);
        });
    });

    describe("getPlayerById", () => {
        it("should return player when found", async () => {
            const mockDoc = {
                exists: true,
                id: "player123",
                data: () => ({ firstName: "Aaron", lastName: "Judge", position: "RF", teamId: "team123", debutYear: 2016, isActive: true }),
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await playerService.getPlayerById("player123");

            expect(result?.firstName).toBe("Aaron");
        });
    });
});