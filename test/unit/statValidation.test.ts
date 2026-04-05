import { createStatSchema, updateStatSchema, statIdParamSchema, playerStatsParamSchema } from "../../src/api/v1/validations/statValidation";

describe("Stat Validation Schemas", () => {
    describe("createStatSchema", () => {
        it("should validate valid stat data", () => {
            const validData = {
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
            const { error } = createStatSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it("should fail when required fields are missing", () => {
            const invalidData = { season: 2023 };
            const { error } = createStatSchema.validate(invalidData);
            expect(error).toBeDefined();
        });
    });

    describe("playerStatsParamSchema", () => {
        it("should validate valid player ID param", () => {
            const validData = { playerId: "player123" };
            const { error } = playerStatsParamSchema.validate(validData);
            expect(error).toBeUndefined();
        });
    });
});