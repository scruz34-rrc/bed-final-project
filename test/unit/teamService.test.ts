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

import * as teamService from "../../src/api/v1/services/teamService";
import * as repository from "../../src/api/v1/repositories/firestoreRepository";

describe("TeamService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllTeams", () => {
        it("should return all teams", async () => {
            const mockSnapshot = {
                docs: [
                    { id: "1", data: () => ({ name: "Yankees", city: "New York", league: "AL", foundedYear: 1901, isActive: true }) },
                    { id: "2", data: () => ({ name: "Red Sox", city: "Boston", league: "AL", foundedYear: 1901, isActive: true }) }
                ]
            };
            (repository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await teamService.getAllTeams();

            expect(repository.getDocuments).toHaveBeenCalledWith("teams");
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("1");
            expect(result[0].name).toBe("Yankees");
        });
    });

    describe("getTeamById", () => {
        it("should return team when found", async () => {
            const mockDoc = {
                exists: true,
                id: "1",
                data: () => ({ name: "Yankees", city: "New York", league: "AL", foundedYear: 1901, isActive: true })
            };
            (repository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await teamService.getTeamById("1");

            expect(repository.getDocumentById).toHaveBeenCalledWith("teams", "1");
            expect(result).not.toBeNull();
            expect(result?.name).toBe("Yankees");
        });

        it("should return null when team not found", async () => {
            (repository.getDocumentById as jest.Mock).mockResolvedValue(null);

            const result = await teamService.getTeamById("999");

            expect(result).toBeNull();
        });
    });

    describe("createTeam", () => {
        it("should create a new team", async () => {
            const teamData = { name: "Dodgers", city: "Los Angeles", league: "NL", foundedYear: 1884, isActive: true };
            (repository.createDocument as jest.Mock).mockResolvedValue("new-id-123");

            const result = await teamService.createTeam(teamData);

            expect(repository.createDocument).toHaveBeenCalledWith("teams", expect.objectContaining(teamData));
            expect(result.id).toBe("new-id-123");
            expect(result.name).toBe("Dodgers");
        });
    });

    describe("deleteTeam", () => {
        it("should delete an existing team", async () => {
            const existingTeam = { id: "1", name: "Yankees", city: "New York", league: "AL", foundedYear: 1901, isActive: true };
            (repository.getDocumentById as jest.Mock).mockResolvedValueOnce({ exists: true, id: "1", data: () => existingTeam });
            (repository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            const result = await teamService.deleteTeam("1");

            expect(repository.deleteDocument).toHaveBeenCalledWith("teams", "1");
            expect(result).toBe(true);
        });
    });
});